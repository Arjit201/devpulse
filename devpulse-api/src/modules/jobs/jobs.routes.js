import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { createJobHandler } from "./jobs.controller.js";
import { createJobSchema } from "./jobs.schema.js";
import { authenticate, requireRecruiter} from '../../middleware/authenticate.js'
const router = Router()
router.post('/',authenticate,requireRecruiter,validate(createJobSchema),createJobHandler)
export default router