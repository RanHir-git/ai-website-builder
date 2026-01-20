/**
 * Projects Routes
 * Route definitions for project endpoints
 */

import express from 'express'
import { protect } from '../../middleware/auth.js'
import * as projectsController from './projects.controller.js'

const router = express.Router()

router.get('/', protect, projectsController.getProjects)
router.get('/community', projectsController.getCommunityProjects)
router.get('/:id', projectsController.getProject)
router.post('/', protect, projectsController.createProject)
router.put('/:id', protect, projectsController.updateProject)
router.patch('/:id/publish', protect, projectsController.togglePublish)
router.delete('/:id', protect, projectsController.deleteProject)

export default router
