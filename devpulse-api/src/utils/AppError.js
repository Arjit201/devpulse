export class AppError extends Error{
    constructor(message,statusCode = 500,code = NULL){
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        Error.captureStackTrace(this,this.constructor);
    }
    static badRequest(msg,code) {return new AppError(msg,400,code);};
    static unauthorized(msg){return new AppError(msg ?? "unauthorized",401);};
    static forbidden(msg){return new AppError(msg ?? "forbidden",403);};
    static notFound(resource){return new AppError(`${resource ?? "Resource"} not found`,404);};
    static conflict(msg){return new AppError(msg,409);};
    static unprocessable(msg,code){return new AppError(msg,422,code);};
}