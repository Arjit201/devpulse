import 'dotenv/config';
import app from "./app.js";
import {logger} from "./config/logger.js";
const port = process.env.PORT;
app.listen(port,()=>{
    logger.info(`server started on http://localhost:${port}`);});