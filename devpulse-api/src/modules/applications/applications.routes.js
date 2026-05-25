import { Router } from 'express'
import { authenticate, requireCandidate, requireJobOwnership, requireRecruiter } from '../../middleware/authenticate.js'
import { validate } from '../../middleware/validate.js'
import { advanceStageSchema, applySchema } from './applications.schema.js'
import { applyHandler,advanceStageHandler,getTimelineHandler,getApplicationHandler,myApplicationsHandler } from './applications.controller.js'

const router = Router()

router.post('/', authenticate, requireCandidate, validate(applySchema), applyHandler)
router.get('/mine',authenticate,requireCandidate,myApplicationsHandler)
router.get('/:id',authenticate,getApplicationHandler)
router.patch('/:id/stage',authenticate,requireRecruiter,validate(advanceStageSchema),advanceStageHandler)
router.get('/:id/timeline',authenticate,getTimelineHandler)
export default router