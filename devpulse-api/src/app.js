import express from "express";
const app = express();
app.use(express.json());
app.get("/health",(_req,res)=>{
    res.json({status:"ok",ts:new Date().toISOString()});
});
app.use((_req,res)=>{
    res.status(404).json({status:"error",message:"Route not found"});
})
export default app;