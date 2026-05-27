import {prisma} from '../config/db.js'
import {logger} from '../config/logger.js'

export async function createNotification({userId,type,payload}){
    try{
        await prisma.notification.create({
            data:{userId,type,payload}
        })
    }
    catch(err){
        logger.error({err,userId,type },'Notification error')
    }
}