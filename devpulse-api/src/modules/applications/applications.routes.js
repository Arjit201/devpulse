import { Router } from 'express'
import { authenticate, requireCandidate } from '../../middleware/authenticate.js'
import { validate } from '../../middleware/validate.js'
import { applySchema } from './applications.schema.js'
import { applyHandler } from './applications.controller.js'

const router = Router()

router.post('/', authenticate, requireCandidate, validate(applySchema), applyHandler)

export default router