import {Worker} from 'bullmq'
import {redis} from '../../config/redis.js'
import {logger} from '../../config/logger.js'
const STAGE_LABELS = {
    screening:'Screening',
    interview:'Interview Round',
    offer:'Offer Extented',
    hired:'Hired',
    rejected:'Application Closed',
}

async function sendEmail({to,subject,body}){
    if(process.env.NODE_ENV !=='production'){
        logger.info({to,subject},`[DEV] Email would be sent : \n${body}`)
        return
    }
    const res = await fetch('https://api.resend.com/emails',{
        method:'POST',
        headers:{
            Authorization:`Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type':'application/json',
        },
        body: JSON.stringify({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html:body,
        })
    })
    if(!res.ok){
        throw new Error(`Email API error: ${await res.text()}`)
    }
}
const handlers = {
    async stage_change({to,candidateName,jobTitle,newStage,applicationId}){
        const label = STAGE_LABELS[newStage] ?? newStage
        await sendEmail({
            to,
            subject:`Your application for "${jobTitle}" has been updated`,
            body:`
                <p>Hi ${candidateName}, </p>
                <p>Your application for <strong>${jobTitle}</strong> has
                moved to the <strong>${label}</strong> stage.</p>
                ${newStage === 'rejected'
                    ?  `<p>While this role did not work out, we wish you the best in your search.</p>`
                    : `<p><a href="${process.env.CLIENT_URL}/candidate/applications/${applicationId}">
                        View you application</a></p>`
                }
                <p>- The DevPulse Team</p> 
            `,
        })
    },
    async new_application({to,recruiterName,candidateName,jobTitle}){
        await sendEmail({
            to,
            subject:`New application for "${jobTitle}"`,
            body:`
                <p>Hi ${recruiterName},</p>
                <p><strong>${candidateName}</strong> just applied to
                <strong>${jobTitle}</strong>.</p>
                <p>— DevPulse</p>
            `,
        })
    },
}
export const emailWorker = new Worker(
    'emails',
    async(job)=>{
        logger.info({jobId:job.id,type:job.name},'Processing email job')
        const handler = handlers[job.name]
        if(!handler){
            logger.warn({type:job.name},'No handler for email type - skipping')
            return
        }
        await handler(job.data)
    },
    {
        connection : redis,
        concurrency:5,
    }
)
emailWorker.on('completed',(job)=>
    logger.info({jobId:job.id,type:job.name},'Email sent')
)
emailWorker.on('failed',(job,err)=>
    logger.error({jobId:job?.id,type:job?.name,err},'Email job failed')
)
logger.info('Email worker started')