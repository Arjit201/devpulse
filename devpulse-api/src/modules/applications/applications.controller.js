import { asyncHandler} from "../../utils/helpers.js";
import { applyToJob,advanceStage,getTimeline } from "./applications.service.js";
export const applyHandler = asyncHandler(async(req,res)=>{
    const application = await applyToJob(req.body,req.user.id)
    res.status(201).json({application})
})
export const advanceStageHandler = asyncHandler(async(req,res)=>{
    const application = await advanceStage(req.params.id,req.body,req.user.id)
    res.json({application})
})
export const getTimelineHandler = asyncHandler(async (req,res)=>{
    const transitions = await getTimeline(req.params.id)
    res.json({transitions})
})