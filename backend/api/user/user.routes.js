/**
 * User Routes
 * Route definitions for user endpoints
 */

import express from 'express'
import { protect } from '../../middleware/auth.js'
import * as userController from './user.controller.js'

const router = express.Router()

// All routes require authentication
router.get('/credits', protect, userController.getUserCredits)
router.get('/profile', protect, userController.getUserProfile)
router.put('/credits', protect, userController.updateUserCredits)
router.patch('/credits/increment', protect, userController.incrementUserCredits)
router.patch('/credits/decrement', protect, userController.decrementUserCredits)
router.patch('/creation/increment', protect, userController.incrementTotalCreation)
router.put('/profile', protect, userController.updateUserProfile)

export default router
