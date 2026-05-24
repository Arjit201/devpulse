import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { createJobHandler } from "./jobs.controller.js";
import { createJobSchema } from "./jobs.schema.js";
import { requireRecruiter } from "../../middleware/authenticate.js";
const router = Router()
router.post('/',authenticate,requireRecruiter,validate(createJobSchema),createJobHandler)
export default router