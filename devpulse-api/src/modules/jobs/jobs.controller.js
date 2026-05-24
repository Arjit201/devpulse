import { createJob } from "./jobs.service.js";
import { asyncHandler } from "../../utils/helpers.js";
export const createJobHandler = asyncHandler(async (req,res)=>{
    const companyId = req.user.recruiterProfile?.companyId
    const job = await createJob(req.body,req.user.id,companyId)
    res.status(201).json({job})
})