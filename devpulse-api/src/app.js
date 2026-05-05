import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
const app = express();
app.use(express.json());
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
app.get("/health",(_req,res)=>{
    res.json({status:"ok",ts:new Date().toISOString()});
});
app.use((_req,res)=>{
    res.status(404).json({status:"error",message:"Route not found"});
})
export default app;