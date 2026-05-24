import { prisma } from '../../config/db.js';
import { createJobSchema } from './jobs.schema.js';
import { AppError } from '../../utils/AppError.js';
const JOB_INCLUDE={
    company:{select:{id:true,name:true,slug:true}},
    _count:{select:{applications:true}},
} 
export async function createJob(data,userId,companyId){
    if(!companyId){
        throw AppError.forbidden("No company associated with your account")
    }
    const job = await prisma.jobPosting.create({
        data : {...data,companyId,postedById:userId},
        include : JOB_INCLUDE,
    })
    return job   
}