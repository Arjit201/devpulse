import 'dotenv/config';
import app from "./app.js";
import {logger} from "./config/logger.js";
import { emailWorker } from './queues/workers/emailWorker.js';
import { redis } from './config/redis.js';
import { prisma } from './config/db.js';
const port = process.env.PORT ?? 3000;

const server = app.listen(port,()=>{
    logger.info(`Server running on http://localhost:${port}`)
})
async function shutdown(signal){
    logger.info({signal},'Shutting down...')
    server.close(async()=>{
        await emailWorker.close()
        await prisma.$disconnect()
        await redis.quit()
        logger.info('Shutdown complete')
        process.exit(0)
    })
    setTimeout(()=>{
        logger.error('Forced shutdown after timeout')
        process.exit(1)
    },10_000)
}
process.on('SIGTERM',()=>shutdown('SIGTERM'))
process.on('SIGINT',()=>shutdown('SIGINT'))
process.on('uncaughtException',(err)=>{
    logger.fatal({err},'Uncaught exception')
    process.exit(1)
})
process.on('unhandledRejection',(err)=>{
    logger.fatal({err},'Unhandled rejection')
    process.exit(1)
})