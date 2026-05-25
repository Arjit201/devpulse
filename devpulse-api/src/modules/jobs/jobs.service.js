import { prisma } from '../../config/db.js';
import { createJobSchema } from './jobs.schema.js';
import { AppError } from '../../utils/AppError.js';
import { cacheGet,cacheSet } from '../../config/redis.js';
import { paginate } from '../../utils/helpers.js';
const JOB_INCLUDE={
    company:{select:{id:true,name:true,slug:true}},
    _count:{select:{applications:true}},
} 
export async function listJobs(query){
    const {search,type,location,cursor,limit=20} = query;
    const cacheKey = `jobs:list:${JSON.stringify(query)}`;
    const cached = await cacheGet(cacheKey);
    if(cached)return cached;
    const where = {
    status: 'open',
    ...(type     && { type }),
    ...(location && { location: { contains: location, mode: 'insensitive' } }),
    ...(search   && {
      OR: [
        { title:       { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  }
    const {items: jobs,total,nextCursor,hasMore} = await paginate(prisma.jobPosting,{where,orderBy:{createdAt:'desc'},cursor,limit,include:JOB_INCLUDE})
    const result = {
        jobs,
        total,
        nextCursor,
        hasMore,
    }
    await cacheSet(cacheKey,result,30)
    return result
}
export async function getJob(id){
    const job = await prisma.jobPosting.findUnique({
        where:{id:jobId},
        include:JOB_INCLUDE,
    })
    if(!job){throw AppError.notFound('Job')}
    return job
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