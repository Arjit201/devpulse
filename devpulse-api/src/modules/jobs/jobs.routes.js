import { Router } from "express";
import { validate, validateQuery } from "../../middleware/validate.js";
import { createJobHandler,getJobHandler,listJobsHandler } from "./jobs.controller.js";
import { createJobSchema, listJobsQuerySchema } from "./jobs.schema.js";
import { authenticate, requireRecruiter} from '../../middleware/authenticate.js'
const router = Router()
router.get('/',validateQuery(listJobsQuerySchema),listJobsHandler)
router.get('/:id',getJobHandler)
router.post('/',authenticate,requireRecruiter,validate(createJobSchema),createJobHandler)
export default router