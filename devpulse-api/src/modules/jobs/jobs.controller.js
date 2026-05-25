import { createJob,listJobs,getJob} from "./jobs.service.js";
import { asyncHandler } from "../../utils/helpers.js";
import { validateQuery } from "../../middleware/validate.js";
export const createJobHandler = asyncHandler(async (req,res)=>{
    const companyId = req.user.recruiterProfile?.companyId
    const job = await createJob(req.body,req.user.id,companyId)
    res.status(201).json({job})
})
export const listJobsHandler = asyncHandler(async (req,res)=>{
    const result = await listJobs(req.query)
    res.json(result)
})
export const getJobHandler = asyncHandler(async(req,res)=>{
    const job = await getJob(req.params.id)
    res.json({job})
})