import { AppError } from '../utils/AppError.js'

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    const message = result.error.issues
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ')
    return next(AppError.unprocessable(message, 'VALIDATION_ERROR'))
  }
  req.body = result.data
  next()
}
export const validateQuery = (schema)=>(req,_res,next)=>{
  const result = schema.safeParse(req.query);
  if(!result.success){
    const message = result.error.errors.map((e)=>`${e.path.join('.')}:${e.message}`).join(', ')
    return next(AppError.unprocessable(message,'VALIDATION_ERROR'))
  }
  Object.assign(req.query, result.data);
  next()
}