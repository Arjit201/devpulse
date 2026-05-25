import { createJob,listJobs,getJob,updateJob,deleteJob} from "./jobs.service.js";
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
export const updateJobHandler = asyncHandler(async(req,res)=>{
    const job = await updateJob(req.params.id,req.body)
    res.json({job})
})
export const deleteJobHandler = asyncHandler(async(req,res)=>{
    await deleteJob(req.params.id)
    res.json({message:'Job closed successfully'})
})