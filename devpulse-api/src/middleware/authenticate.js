import jwt from 'jsonwebtoken';
import {AppError} from '../utils/AppError.js';
import {asyncHandler} from '../utils/helpers.js';
import {prisma} from '../config/db.js';

export const authenticate = asyncHandler(async(req,res,next)=>{
    const auth = req.headers.authorization;
    if(!auth?.startsWith('Bearer '))throw AppError.unauthorized();
    const token = auth.split(' ')[1];
    let payload;
    try{
        payload = jwt.verify(token,process.env.JWT_ACCESS_SECRET);
    }
    catch{
        throw AppError.unauthorized('Token invalid or expired');
    }
    const user = await prisma.user.findUnique({
        where:{id:payload.sub},
        select:{
            id:true,
            email:true,
            name:true,
            role:true,
            recruiterProfile:{select:{companyId:true}},
        },
    })
    if(!user)throw AppError.unauthorized("user not found");
    req.user = user;
    next();
})
export const requireRole = (...roles)=>asyncHandler(async(req,_res,next)=>{
    if(!roles.includes(req.user.role))throw AppError.forbidden();
    next();
});
export const requireRecruiter = requireRole('recruiter','company_admin');
export const requireCandidate = requireRole('candidate');
export const requireAdmin = requireRole('company_admin');
export const requireJobOwnership = asyncHandler(async(req,_res,next)=>{
    const jobId = req.params.jobId ?? req.params.id
    if(!jobId) {return next()}
    const job = await prisma.jobPosting.findUnique({
        where: {id : jobId},
        select:{companyId:true},
    })
    if(!job){throw AppError.notFound('Job')}
    const companyId = req.user.recruiterProfile?.companyId
    if(job.companyId !== companyId){
        throw AppError.forbidden('You do not own this Job posting')
    }
    req.job = job;
    next();
})