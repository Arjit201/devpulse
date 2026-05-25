import {isValidTransition} from '../../config/stageTransitions.js'
import {prisma} from '../../config/db.js'
import {AppError} from '../../utils/AppError.js'
export async function applyToJob({jobId,coverLetter},userId){
    const profile = await prisma.candidateProfile.findUnique({
        where:{userId}
    })
    if(!profile) {throw AppError.notFound('Candidate Profile')}
    const job = await prisma.jobPosting.findUnique({
        where:{id:jobId},
        select:{id:true,status:true,title:true},
    })
    if(!job){throw AppError.notFound('Job')}
    if(job.status!=='open'){throw AppError.badRequest('This job is not accepting applications')}
    const application = await prisma.application.create({
        data:{
            jobId,
            candidateId : profile.id,
            coverLetter,
            resumeSnapshotUrl:profile.resumeUrl,
        },
        include:{
            job:{include:{company:true}},
        }
    })
    return application
}
export async function advanceStage(applicationId,{stage:toStage,note},recruiterId){
    const app = await prisma.application.findUnique({
        where:{id:applicationId},
        include:{
            job:{
                select:{companyId:true,title:true,postedById:true},
            },
            candidate:{
                include:{
                    user:{
                        select:{email:true,name:true},
                    },
                },
            },
        },
    })
    if(!app){throw AppError.notFound('Application')}
    const recruiter = await prisma.user.findUnique({
        where:{id:recruiterId},
        select:{recruiterProfile:{select:{companyId:true}}}
    })
    if(app.job.companyId !== recruiter?.recruiterProfile?.companyId){throw AppError.forbidden()}
    if(!isValidTransition(app.stage,toStage)){
        throw AppError.unprocessable(`Cannot transition from ${app.stage} to ${toStage}`,'INVALID_TRANSITION')
    }
    const updatedApp = await prisma.$transaction([
        prisma.application.update({
            where:{id:applicationId},
            data:{stage:toStage},
        }),
        prisma.stageTransition.create({
            data:{
                applicationId,
                changedById:recruiterId,
                fromStage:app.stage,
                toStage,
                note,
            }
        })
    ])
    return updatedApp

}