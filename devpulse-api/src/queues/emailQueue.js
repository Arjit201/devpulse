import {Queue} from 'bullmq'
import {redis} from '../config/redis.js'
import {logger} from '../config/logger.js'

export const emailQueue = new Queue('emails',{
    connection:redis,
    defaultJobOptions:{
        attempts:3,
        backoff:{
            type:'exponential',
            delay:3000,
        },
        removeOnComplete:{count:100},
        removeOnFail:{count:50},
    }
})
export async function queueStageChangeEmail(
    to,
    candidateName,
    jobTitle,
    newStage,
    applicationId
){

    await emailQueue.add('stage_change',{
        to,
        candidateName,
        jobTitle,
        newStage,
        applicationId
    })
    logger.info({to,newStage},'Queued stage_change email')
}
export async function newApplicationEmail({
    to,
    recruiterName,
    candidateName,
    jobTitle,
    applicationId
}){
    await emailQueue.add('new_application',{
        to,
        recruiterName,
        candidateName,
        jobTitle,
        applicationId
    })
    logger.info({to},'Queued new_application email')
}