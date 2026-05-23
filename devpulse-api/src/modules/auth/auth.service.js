import bcrypt from 'bcryptjs';
import {prisma} from '../../config/db.js';
import {AppError} from '../../utils/AppError.js';
import jwt from 'jsonwebtoken'

export function signAccessToken(userId) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES ?? '15m' }
  )
}

export function signRefreshToken(userId) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES ?? '7d' }
  )
}
export async function loginUser({email,password}){
  const user = await prisma.user.findUnique({where: {email}});
  const DUMMY_HASH = "$2a$12$dummyhashtopreventtimingattacksxx";
  const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
  const valid = await bcrypt.compare(password,hashToCompare);
  if(!user || !valid) throw AppError.unauthorized('Invalid email or password');
  const {passwordHash: _, ...safeUser} = user;
  const accessToken  = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  return {user: safeUser,accessToken,refreshToken};
}
export async function registerUser({name,email,password,role}){
    const existing = await prisma.user.findUnique({where:{email}});
    if(existing) throw AppError.conflict('Email already registered');
    const passwordHash = await bcrypt.hash(password,12);
    const user = await prisma.user.create({
        data:{name,email,passwordHash,role},
        select:{id:true,email:true,name:true,role:true,createdAt:true},
    });
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    return {user, accessToken, refreshToken}; 
}