import { Router } from 'express'
import { validate } from '../../middleware/validate.js'
import { registerSchema,loginSchema } from './auth.schema.js'
import { register,login,refresh,logout } from './auth.controller.js'

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login',validate(loginSchema),login);
router.post('/logout',logout);
router.post('/refresh',refresh);
export default router;