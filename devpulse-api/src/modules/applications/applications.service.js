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