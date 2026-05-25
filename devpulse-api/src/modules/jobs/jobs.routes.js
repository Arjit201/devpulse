import { Router } from "express";
import { validate, validateQuery } from "../../middleware/validate.js";
import { createJobHandler,getJobHandler,listJobsHandler,deleteJobHandler,updateJobHandler } from "./jobs.controller.js";
import { createJobSchema, listJobsQuerySchema ,updateJobSchema } from "./jobs.schema.js";
import { authenticate, requireJobOwnership, requireRecruiter} from '../../middleware/authenticate.js'
const router = Router()
router.get('/',validateQuery(listJobsQuerySchema),listJobsHandler)
router.get('/:id',getJobHandler)
router.post('/',authenticate,requireRecruiter,validate(createJobSchema),createJobHandler)
router.patch('/:id',authenticate,requireRecruiter,requireJobOwnership,validate(updateJobSchema),updateJobHandler)
router.delete('/:id',authenticate,requireRecruiter,requireJobOwnership,deleteJobHandler)
export default router