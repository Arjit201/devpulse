import { asyncHandler} from "../../utils/helpers.js";
import { applyToJob } from "./applications.service.js";
export const applyHandler = asyncHandler(async(req,res)=>{
    const application = await applyToJob(req.body,req.user.id)
    res.status(201).json({application})
})