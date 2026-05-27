import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import {errorHandler} from './middleware/errorHandler.js';
import {AppError} from './utils/AppError.js';
import {z} from 'zod';
import {validate} from './middleware/validate.js';
import authRouter from './modules/auth/auth.routes.js';
import cookieParser from 'cookie-parser'
import jobsRouter from './modules/jobs/jobs.routes.js'
import applicationsRouter from './modules/applications/applications.routes.js'
import notificationsRouter from './modules/notifications/notifications.routes.js'
const app = express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT;
app.use(helmet());//security http headers
app.use(cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    credentials:true
}));
app.use(morgan('dev'));//security logging
const limiter = rateLimit({
    windowMs: 15*60*1000,
    max:100,
    message:{status:'error',message:'Too many requests, try again later'}
});
app.use(limiter);
app.use('/api/v1/auth', authRouter);
app.get("/health",(_req,res)=>{
    res.json({status:"ok",ts:new Date().toISOString()});
});
const testSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(18),
})

app.post('/test-validate', validate(testSchema), (req, res) => {
  res.json({ valid: true, data: req.body })
})
app.use('/api/v1/jobs',jobsRouter)
app.use('/api/v1/applications',applicationsRouter)
app.use('/api/v1/notifications',notificationsRouter)
app.use((_req,res)=>{
    res.status(404).json({status:"error",message:"Route not found"});
})
app.use(errorHandler);
export default app;