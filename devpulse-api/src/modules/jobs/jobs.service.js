import { prisma } from '../../config/db.js';
import { createJobSchema } from './jobs.schema.js';
import { AppError } from '../../utils/AppError.js';
import { cacheDelPattern, cacheGet,cacheSet } from '../../config/redis.js';
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
    await cacheDelPattern('jobs:list:*')
    return job   
}
export async function updateJob(id,data){
    const job = await prisma.jobPosting.update({
        where:{id},
        data,
        include:JOB_INCLUDE,
    })
    await cacheDelPattern('jobs:list:*')
    return job
}
export async function deleteJob(id){
    await prisma.jobPosting.update({
        where:{id},
        data:{status:'closed'},
    })
    await cacheDelPattern('jobs:list:*')
}
export async function getJobApplications(jobId){
    const applications = await prisma.jobPostings.findMany({
        where:{jobId},
        include:{
            candidate:{
                include:{
                    user:{select:{id:true,name:true,email:true}},
                },
            },
        },
        orderBy:{appliedAt:'desc'},
    })
    return applications.map(({candidate,...app})=>({
        ...app,
        candidate:{
            id : candidate.id,
            name : candidate.user.name,
            email:candidate.user.email,
            headline:candidate.headline,
            skills:candidate.skills,
        },
    }))
}
export async function getJobAnalytics(jobId){
    const stageCounts = await prisma.application.groupBy({
        by: ['stage'],
        where: { jobId },
        _count: { stage: true },
    })

    const avgTimeRaw = await prisma.$queryRaw`
        SELECT AVG(
        EXTRACT(EPOCH FROM (st.created_at - a.applied_at)) / 3600
        ) AS avg_hours
        FROM stage_transitions st
        JOIN applications a ON a.id = st.application_id
        WHERE a.job_id = ${jobId}
        AND st.from_stage = 'applied'
        AND st.to_stage   = 'screening'
    `

    return {
        stageCounts: stageCounts.map((s) => ({
        stage: s.stage,
        count: s._count.stage,
        })),
        avgHoursToFirstScreen: Number(avgTimeRaw[0]?.avg_hours ?? 0).toFixed(1),
    }
}