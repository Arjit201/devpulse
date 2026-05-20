import { asyncHandler } from '../../utils/helpers.js'
import { registerUser } from './auth.service.js'

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body)
  res.status(201).json({ user })
});