/**
 * Auth Routes
 * Route definitions for authentication endpoints
 */

import express from 'express'
import { protect } from '../../middleware/auth.js'
import * as authController from './auth.controller.js'

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', protect, authController.getMe)
router.post('/logout', protect, authController.logout)

export default router
