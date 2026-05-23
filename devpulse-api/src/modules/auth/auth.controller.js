import { asyncHandler } from '../../utils/helpers.js'
import { registerUser , loginUser , refreshTokens, logoutUser } from './auth.service.js'
import {AppError} from '../../utils/AppError.js';

const COOKIE_OPTS = {
  httpOnly:true,
  secure: process.env.NODE_ENV === 'production',
  sameSite : 'lax',
  maxAge : 7*24*60*60*1000,
}
export const login = asyncHandler(async (req,res)=>{
  const {user,accessToken,refreshToken} = await loginUser(req.body);
  res.cookie('refreshToken',refreshToken,COOKIE_OPTS);
  res.json({user,accessToken});
})

export const register = asyncHandler(async (req, res) => {
  const {user,accessToken,refreshToken} = await registerUser(req.body);
  res.cookie('refreshToken',refreshToken,COOKIE_OPTS);
  res.status(201).json({ user,accessToken })
});

export const refresh = asyncHandler(async(req,res)=>{
  const token = req.cookies?.refreshToken;
  if(!token) throw AppError.unauthorized('No refresh token');
  const {accessToken,refreshToken} = await refreshTokens(token);
  res.cookie('refreshToken',refreshToken,COOKIE_OPTS);
  res.json({accessToken});
})
export const logout = asyncHandler(async(req,res)=>{
  const token = req.cookies?.refreshToken;
  await logoutUser(token);
  res.clearCookie('refreshToken');
  res.json({message:'Logged out'});
})
