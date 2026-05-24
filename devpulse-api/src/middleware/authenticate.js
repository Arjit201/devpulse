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