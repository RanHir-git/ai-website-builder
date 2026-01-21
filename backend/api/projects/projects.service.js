/**
 * Projects Service
 * Business logic for project operations
 */

import Project from '../../models/Project.js'
import Conversation from '../../models/Conversation.js'
import Version from '../../models/Version.js'
import User from '../../models/User.js'
import jwt from 'jsonwebtoken'
import * as aiService from '../ai/ai.service.js'
import * as userService from '../user/user.service.js'

/**
 * Format project data with conversations and versions
 * @param {Object} project - Mongoose project document
 * @returns {Promise<Object>} Formatted project object
 */
const formatProjectData = async (project) => {
  const conversations = await Conversation.find({ projectId: project._id })
    .sort({ timestamp: 1 })
  
  const versions = await Version.find({ projectId: project._id })
    .sort({ timestamp: -1 })

  return {
    id: project._id,
    name: project.name,
    title: project.name,
    initialPrompt: project.initialPrompt,
    current_code: project.currentCode,
    current_version_index: project.currentVersionIndex,
    userId: project.userId._id,
    user: {
      id: project.userId._id,
      name: project.userId.name,
      email: project.userId.email,
    },
    isPublished: project.isPublished,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    conversation: conversations.map(conv => ({
      id: conv._id,
      role: conv.role,
      content: conv.content,
      timestamp: conv.timestamp,
    })),
    versions: versions.map(ver => ({
      id: ver._id,
      code: ver.code,
      description: ver.description,
      timestamp: ver.timestamp,
    })),
  }
}

/**
 * Format project data without conversations and versions (for community)
 * @param {Object} project - Mongoose project document
 * @returns {Object} Formatted project object
 */
const formatProjectDataSimple = (project) => {
  return {
    id: project._id,
    name: project.name,
    title: project.name,
    initialPrompt: project.initialPrompt,
    current_code: project.currentCode,
    current_version_index: project.currentVersionIndex,
    userId: project.userId._id,
    user: {
      id: project.userId._id,
      name: project.userId.name,
      email: project.userId.email,
    },
    isPublished: project.isPublished,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }
}

/**
 * Verify user owns project or project is published
 * @param {Object} project - Project document
 * @param {string} token - JWT token (optional)
 * @returns {Promise<Object>} User object if authenticated
 */
export const verifyProjectAccess = async (project, token) => {
  // If published, allow public access
  if (project.isPublished) {
    return null // No user required
  }

  // Private project - require authentication
  if (!token) {
    throw new Error('Not authorized to access this route')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user) {
      throw new Error('Not authorized to access this route')
    }

    // Check if user owns the project
    if (project.userId._id.toString() !== user._id.toString()) {
      throw new Error('You do not have permission to access this project')
    }

    return user
  } catch (error) {
    if (error.message.includes('authorized') || error.message.includes('permission')) {
      throw error
    }
    throw new Error('Not authorized to access this route')
  }
}

/**
 * Get all projects for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of projects
 */
export const getUserProjects = async (userId) => {
  const projects = await Project.find({ userId })
    .populate('userId', 'name email')
    .sort({ updatedAt: -1 })

  const projectsWithData = await Promise.all(
    projects.map(project => formatProjectData(project))
  )

  return projectsWithData
}

/**
 * Get all community projects (published)
 * @returns {Promise<Array>} Array of published projects
 */
export const getCommunityProjects = async () => {
  const projects = await Project.find({ isPublished: true })
    .populate('userId', 'name email')
    .sort({ updatedAt: -1 })

  return projects.map(project => formatProjectDataSimple(project))
}

/**
 * Get a single project by ID
 * @param {string} projectId - Project ID
 * @param {string} token - JWT token (optional)
 * @returns {Promise<Object>} Project object
 */
export const getProjectById = async (projectId, token) => {
  const project = await Project.findById(projectId).populate('userId', 'name email')

  if (!project) {
    throw new Error('Project not found')
  }

  // Verify access (throws error if not authorized)
  await verifyProjectAccess(project, token)

  return await formatProjectData(project)
}

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created project
 */
export const createProject = async (projectData, userId) => {
  const { name, initialPrompt, current_code, conversation, versions, current_version_index } = projectData

  let generatedCode = current_code || ''
  let conversationsToSave = conversation || []

  // If no code provided, generate it using AI
  if (!current_code && initialPrompt) {
    try {
      // Check if user has enough credits before generating
      const user = await User.findById(userId)
      if (!user || user.credits < 5) {
        throw new Error('Insufficient credits to create project')
      }

      const aiResult = await aiService.createProjectWithAI(initialPrompt)
      generatedCode = aiResult.htmlCode

      // Deduct 5 credits for AI generation
      await userService.decrementUserCredits(userId, 5)
      
      // Increment total creation count
      await userService.incrementTotalCreation(userId)

      // Save user prompt and AI response to conversation
      conversationsToSave = [
        {
          role: 'user',
          content: aiResult.userMessage, // Original user prompt
          timestamp: new Date(),
        },
        {
          role: 'assistant',
          content: aiResult.aiMessage, // AI-generated HTML
          timestamp: new Date(),
        },
      ]
    } catch (error) {
      console.error('AI generation failed:', error)
      // Re-throw error if it's about credits
      if (error.message.includes('credits') || error.message.includes('Insufficient')) {
        throw error
      }
      // Re-throw AI errors so user knows what went wrong
      throw new Error(`AI generation failed: ${error.message || 'Unknown error. Please try again.'}`)
    }
  }

  // Create project
  const project = await Project.create({
    name,
    initialPrompt,
    currentCode: generatedCode,
    currentVersionIndex: current_version_index || '',
    userId,
    isPublished: false,
  })

  // Save conversations (user prompt + AI response)
  if (conversationsToSave.length > 0) {
    await Conversation.insertMany(
      conversationsToSave.map(conv => ({
        role: conv.role,
        content: conv.content,
        projectId: project._id,
        timestamp: conv.timestamp || new Date(),
      }))
    )
  }

  // Automatically create initial version if code was generated
  if (generatedCode) {
    const initialVersion = await Version.create({
      code: generatedCode,
      description: 'Initial version',
      projectId: project._id,
      timestamp: new Date(),
    })
    // Set current version index to the initial version
    project.currentVersionIndex = initialVersion._id.toString()
    await project.save()
  }

  // Create additional versions if provided
  if (versions && Array.isArray(versions) && versions.length > 0) {
    await Version.insertMany(
      versions.map(ver => ({
        code: ver.code,
        description: ver.description || '',
        projectId: project._id,
        timestamp: ver.timestamp || new Date(),
      }))
    )
  }

  const populatedProject = await Project.findById(project._id)
    .populate('userId', 'name email')

  return await formatProjectData(populatedProject)
}

/**
 * Update a project
 * @param {string} projectId - Project ID
 * @param {Object} projectData - Updated project data
 * @param {string} userId - User ID (must be owner)
 * @returns {Promise<Object>} Updated project
 */
export const updateProject = async (projectId, projectData, userId) => {
  const project = await Project.findById(projectId)

  if (!project) {
    throw new Error('Project not found')
  }

  // Check if user owns the project
  if (project.userId.toString() !== userId.toString()) {
    throw new Error('You do not have permission to update this project')
  }

  // Update project fields
  const { name, initialPrompt, current_code, current_version_index, conversation, versions, modificationRequest } = projectData

  if (name !== undefined) project.name = name
  if (initialPrompt !== undefined) project.initialPrompt = initialPrompt
  if (current_version_index !== undefined) project.currentVersionIndex = current_version_index

  // Handle AI modification if modificationRequest is provided
  if (modificationRequest && project.currentCode) {
    try {
      const aiResult = await aiService.modifyProjectWithAI(project.currentCode, modificationRequest)
      const oldCode = project.currentCode
      project.currentCode = aiResult.htmlCode

      // Save user request and AI response to conversation
      await Conversation.insertMany([
        {
          role: 'user',
          content: aiResult.userMessage, // Original user modification request
          projectId: project._id,
          timestamp: new Date(),
        },
        {
          role: 'assistant',
          content: aiResult.aiMessage, // AI-modified HTML
          projectId: project._id,
          timestamp: new Date(),
        },
      ])

      // Automatically create a new version after AI modification
      const newVersion = await Version.create({
        code: aiResult.htmlCode,
        description: `Modified: ${modificationRequest.substring(0, 50)}${modificationRequest.length > 50 ? '...' : ''}`,
        projectId: project._id,
        timestamp: new Date(),
      })
      // Update current version index to the new version
      project.currentVersionIndex = newVersion._id.toString()
    } catch (error) {
      console.error('AI modification failed:', error)
      throw new Error('Failed to modify project with AI')
    }
  } else if (current_code !== undefined) {
    // Manual code update (no AI)
    project.currentCode = current_code
  }

  await project.save()

  // Update conversations if provided manually (for non-AI updates)
  if (conversation && Array.isArray(conversation) && !modificationRequest) {
    await Conversation.deleteMany({ projectId: project._id })
    await Conversation.insertMany(
      conversation.map(conv => ({
        role: conv.role,
        content: conv.content,
        projectId: project._id,
        timestamp: conv.timestamp || new Date(),
      }))
    )
  }

  // Create a new version when code is manually updated (not from AI)
  if (current_code !== undefined && !modificationRequest && project.currentCode !== current_code) {
    const newVersion = await Version.create({
      code: project.currentCode,
      description: 'Manual save',
      projectId: project._id,
      timestamp: new Date(),
    })
    // Update current version index to the new version
    project.currentVersionIndex = newVersion._id.toString()
    await project.save()
  }

  // Update versions if provided manually (for bulk updates)
  if (versions && Array.isArray(versions) && versions.length > 0) {
    await Version.deleteMany({ projectId: project._id })
    await Version.insertMany(
      versions.map(ver => ({
        code: ver.code,
        description: ver.description || '',
        projectId: project._id,
        timestamp: ver.timestamp || new Date(),
      }))
    )
  }

  const populatedProject = await Project.findById(project._id)
    .populate('userId', 'name email')

  return await formatProjectData(populatedProject)
}

/**
 * Toggle publish status of a project
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID (must be owner)
 * @returns {Promise<Object>} Updated project
 */
export const togglePublish = async (projectId, userId) => {
  const project = await Project.findById(projectId)

  if (!project) {
    throw new Error('Project not found')
  }

  // Check if user owns the project
  if (project.userId.toString() !== userId.toString()) {
    throw new Error('You do not have permission to update this project')
  }

  // Toggle publish status
  project.isPublished = !project.isPublished
  await project.save()

  const populatedProject = await Project.findById(project._id)
    .populate('userId', 'name email')

  return formatProjectDataSimple(populatedProject)
}

/**
 * Delete a project
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID (must be owner)
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId, userId) => {
  const project = await Project.findById(projectId)

  if (!project) {
    throw new Error('Project not found')
  }

  // Check if user owns the project
  if (project.userId.toString() !== userId.toString()) {
    throw new Error('You do not have permission to delete this project')
  }

  // Delete project and related data
  await Project.findByIdAndDelete(projectId)
  await Conversation.deleteMany({ projectId })
  await Version.deleteMany({ projectId })
}
