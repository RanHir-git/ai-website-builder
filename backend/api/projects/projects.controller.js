/**
 * Projects Controller
 * Handles HTTP requests and responses for projects
 */

import * as projectsService from './projects.service.js'

/**
 * @desc    Get all projects for current user
 * @route   GET /api/projects
 * @access  Private
 */
export const getProjects = async (req, res, next) => {
  try {
    const projects = await projectsService.getUserProjects(req.user._id)

    res.json({
      success: true,
      data: projects,
      message: 'Projects retrieved successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all community projects (published)
 * @route   GET /api/projects/community
 * @access  Public
 */
export const getCommunityProjects = async (req, res, next) => {
  try {
    const projects = await projectsService.getCommunityProjects()

    res.json({
      success: true,
      data: projects,
      message: 'Community projects retrieved successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get a single project by ID
 * @route   GET /api/projects/:id
 * @access  Public if published, Private (must be owner) if not published
 */
export const getProject = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const project = await projectsService.getProjectById(req.params.id, token)

    res.json({
      success: true,
      data: project,
      message: 'Project retrieved successfully',
    })
  } catch (error) {
    if (error.message === 'Project not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    if (error.message.includes('authorized') || error.message.includes('permission')) {
      const statusCode = error.message.includes('permission') ? 403 : 401
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
export const createProject = async (req, res, next) => {
  try {
    const { name, initialPrompt } = req.body

    // Validation
    if (!name || !initialPrompt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and initialPrompt',
      })
    }

    const project = await projectsService.createProject(req.body, req.user._id)

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    })
  } catch (error) {
    // Handle insufficient credits error
    if (error.message.includes('credits') || error.message.includes('Insufficient')) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Insufficient credits to create project',
      })
    }
    next(error)
  }
}

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private (must be owner)
 */
export const updateProject = async (req, res, next) => {
  try {
    const project = await projectsService.updateProject(
      req.params.id,
      req.body,
      req.user._id
    )

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    })
  } catch (error) {
    if (error.message === 'Project not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    if (error.message.includes('permission')) {
      return res.status(403).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * @desc    Toggle publish status of a project
 * @route   PATCH /api/projects/:id/publish
 * @access  Private (must be owner)
 */
export const togglePublish = async (req, res, next) => {
  try {
    const project = await projectsService.togglePublish(req.params.id, req.user._id)

    res.json({
      success: true,
      data: project,
      message: `Project ${project.isPublished ? 'published' : 'unpublished'} successfully`,
    })
  } catch (error) {
    if (error.message === 'Project not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    if (error.message.includes('permission')) {
      return res.status(403).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private (must be owner)
 */
export const deleteProject = async (req, res, next) => {
  try {
    await projectsService.deleteProject(req.params.id, req.user._id)

    res.json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    if (error.message === 'Project not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    if (error.message.includes('permission')) {
      return res.status(403).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}
