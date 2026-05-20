import {AppError} from "../utils/AppError.js";
import {logger} from "../config/logger.js";

export function errorHandler(err,req,res,next){
    if(err.code === "P2002"){
        const field = err.meta?.target?.[0] ?? "field";
        return res.status(409).json({
            status:'error',
            code:'CONFLICT',
            message:`A record with this ${field} already exists`,
        });
    };
    if(err.code==='P2025'){
        return res.status(404).json({
            status:'error',
            code:'NOT_FOUND',
            message:'Record not found',
        });
    };
    if(err instanceof AppError && err.isOperational){
        return res.status(err.statusCode).json({
            status:'error',
            code:err.code ?? 'ERROR',
            message: err.message,
        });
    };
    logger.error({err,req:{method:req.method,url:req.url}},'Unhandled error');
    const message = process.env.NODE_ENV === 'production'
        ? 'Something went wrong' : err.message;
    return res.status(500).json({status:'error',code:'INTERNAL_ERROR',message});    
}