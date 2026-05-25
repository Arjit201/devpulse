import { Router } from 'express'
import { authenticate, requireCandidate, requireJobOwnership, requireRecruiter } from '../../middleware/authenticate.js'
import { validate } from '../../middleware/validate.js'
import { advanceStageSchema, applySchema } from './applications.schema.js'
import { applyHandler,advanceStageHandler,getTimelineHandler } from './applications.controller.js'

const router = Router()

router.post('/', authenticate, requireCandidate, validate(applySchema), applyHandler)
router.patch('/:id/stage',authenticate,requireRecruiter,validate(advanceStageSchema),advanceStageHandler)
router.get('/:id/timeline',authenticate,getTimelineHandler)
export default router