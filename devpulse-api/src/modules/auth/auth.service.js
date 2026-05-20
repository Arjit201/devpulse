import bcrypt from 'bcryptjs';
import {prisma} from '../../config/db.js';
import {AppError} from '../../utils/AppError.js';

export async function registerUser({name,email,password,role}){
    const existing = await prisma.user.findUnique({where:{email}});
    if(existing) throw AppError.conflict('Email already registered');
    const passwordHash = await bcrypt.hash(password,12);
    const user = await prisma.user.create({
        data:{name,email,passwordHash,role},
        select:{id:true,email:true,name:true,role:true,createdAt:true},
    });
    return user; 
}