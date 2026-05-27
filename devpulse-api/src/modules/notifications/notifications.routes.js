import {prisma} from '../../config/db.js'
import {logger} from '../../config/logger.js'
import {authenticate} from '../../middleware/authenticate.js'
import {asyncHandler,paginate} from '../../utils/helpers.js'
import {Router} from 'express'

const router = Router()
router.get('/',authenticate,asyncHandler(async(req,res)=>{
    const {items:notifications,total,nextCursor } = await paginate(prisma.notification,{
        where:{userId:req.user.id},
        orderBy:{createdAt:'desc'},
        limit:req.query.limit ?? 30,
        cursor: req.query.cursor
    })
    res.json({notifications,total,nextCursor})
}))
router.patch('/read-all',authenticate,asyncHandler(async(req,res)=>{
    await prisma.notification.updateMany({
        where:{userId:req.user.id,read:false},
        data:{read:true}
    })
    res.json({ok:true})
}))
router.patch('/:id/read',authenticate,asyncHandler(async(req,res)=>{
    await prisma.notification.updateMany({
        where:{id:req.params.id,userId:req.user.id},
        data:{read:true},
    })
    res.json({ok:true})
}))
export default router