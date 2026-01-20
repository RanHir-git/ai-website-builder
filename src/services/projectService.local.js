/**
 * Project service - Local storage version
 * Handles all project-related operations using localStorage and dataService
 */

import { getProjects as getProjectsFromData, saveProjects as saveProjectsToData } from './dataService'

// In-memory cache for projects
let projects = []
let nextId = 1

// Import getCurrentUser from authService to ensure we use the logged-in user
import { getCurrentUser as getCurrentUserFromAuth } from './authService.local'

/**
 * Get current user from authService
 * Returns null if no user is logged in (no fallback to dummy user)
 */
const getCurrentUser = async () => {
  try {
    const user = await getCurrentUserFromAuth()
    return user || null
  } catch {
    return null
  }
}

// Import dummy data from assets
import { dummyUser, dummyProjects } from '../data/assets.ts'

// Transform dummy projects to match projectService structure
const transformDummyProjects = () => {
  return dummyProjects.map(project => ({
    id: project.id,
    name: project.name,
    title: project.name, // Add title as alias for name (used in some components)
    initialPrompt: project.initial_prompt, // Convert snake_case to camelCase
    current_code: project.current_code,
    current_version_index: project.current_version_index,
    // Ensure userId matches user.id for consistency
    userId: (project.user || dummyUser).id,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    isPublished: project.isPublished !== undefined ? project.isPublished : true,
    conversation: project.conversation || [],
    versions: project.versions || [],
    user: project.user || dummyUser,
  }))
}

/**
 * Load projects from localStorage or initialize with dummy data
 */
const loadProjects = () => {
  const storedProjects = getProjectsFromData()
  if (storedProjects && storedProjects.length > 0) {
    projects = storedProjects
  } else {
    // Initialize with dummy data if localStorage is empty
    projects = transformDummyProjects()
    saveProjectsToData(projects)
  }
  // Set nextId to be higher than any existing project ID
  const maxId = Math.max(...projects.map(p => {
    if (typeof p.id === 'string') return 0
    return typeof p.id === 'number' ? p.id : 0
  }), 0)
  nextId = maxId + 1
}

/**
 * Save projects to localStorage
 */
const saveProjects = () => {
  saveProjectsToData(projects)
}

// Initialize on first load
loadProjects()

/**
 * Simulate network delay for realistic behavior
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise}
 */
const delay = (ms = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Get all projects for the current user
 * @returns {Promise<Array>} Array of projects
 */
export const getProjects = async () => {
  await delay(1000)
  const currentUser = await getCurrentUser()
  if (!currentUser || !currentUser.id) {
    return {
      data: [],
      message: 'No user logged in'
    }
  }
  // Filter projects by current user - handle both string and number IDs
  const userProjects = projects.filter(p => {
    const projectUserId = String(p.userId)
    const currentUserId = String(currentUser.id)
    return projectUserId === currentUserId
  })
  return {
    data: [...userProjects],
    message: 'Projects retrieved successfully'
  }
}

/**
 * Get all community projects (published projects from all users)
 * @returns {Promise<Array>} Array of published projects
 */
export const getCommunityProjects = async () => {
  await delay(1000)
  // Return all published projects
  const communityProjects = projects.filter(p => p.isPublished === true)
  return {
    data: [...communityProjects],
    message: 'Community projects retrieved successfully'
  }
}

/**
 * Get a single project by ID
 * @param {string|number} projectId
 * @returns {Promise<Object>} Project object
 */
export const getProject = async (projectId) => {
  await delay(1000)
  const currentUser = await getCurrentUser()
  // Handle both string and number IDs
  const project = projects.find(p => String(p.id) === String(projectId))
  
  if (!project) {
    throw new Error(`Project with ID ${projectId} not found`)
  }
  
  // Verify the project belongs to the current user
  if (String(project.userId) !== String(currentUser.id)) {
    throw new Error('You do not have permission to access this project')
  }
  
  return {
    data: { ...project },
    message: 'Project retrieved successfully'
  }
}

/**
 * Create a new project
 * @param {Object} projectData - { name, description, ... }
 * @returns {Promise<Object>} Created project
 */
export const createProject = async (projectData) => {
  await delay(1000)
  const currentUser = await getCurrentUser()
  if (!currentUser || !currentUser.id) {
    throw new Error('You must be logged in to create a project')
  }
  
  const newProject = {
    id: nextId++,
    ...projectData,
    userId: currentUser.id,
    user: { ...currentUser }, // Store user info in project
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    conversation: projectData.conversation || [], // Initialize empty array if not provided
    versions: projectData.versions || [], // Initialize empty array if not provided
    current_version_index: projectData.current_version_index || '', // Initialize empty string if not provided
  }
  
  projects.push(newProject)
  saveProjects()
  
  return {
    data: { ...newProject },
    message: 'Project created successfully'
  }
}

/**
 * Update a project
 * @param {string|number} projectId
 * @param {Object} projectData - Updated project data
 * @returns {Promise<Object>} Updated project
 */
export const updateProject = async (projectId, projectData) => {
  await delay(1000)
  const currentUser = await getCurrentUser()
  
  // Handle both string and number IDs
  const index = projects.findIndex(p => String(p.id) === String(projectId))
  
  if (index === -1) {
    throw new Error(`Project with ID ${projectId} not found`)
  }
  
  // Verify the project belongs to the current user
  if (String(projects[index].userId) !== String(currentUser.id)) {
    throw new Error('You do not have permission to update this project')
  }
  
  projects[index] = {
    ...projects[index],
    ...projectData,
    // Don't allow changing userId or user
    userId: projects[index].userId,
    user: projects[index].user,
    updatedAt: new Date().toISOString(),
  }
  saveProjects()
  
  return {
    data: { ...projects[index] },
    message: 'Project updated successfully'
  }
}

/**
 * Delete a project
 * @param {string|number} projectId
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId) => {
  await delay(1000)
  const currentUser = await getCurrentUser()
  
  // Handle both string and number IDs
  const index = projects.findIndex(p => String(p.id) === String(projectId))
  
  if (index === -1) {
    throw new Error(`Project with ID ${projectId} not found`)
  }
  
  // Verify the project belongs to the current user
  if (String(projects[index].userId) !== String(currentUser.id)) {
    throw new Error('You do not have permission to delete this project')
  }
  
  projects.splice(index, 1)
  saveProjects()
  
  return {
    message: 'Project deleted successfully'
  }
}

/**
 * Clear all projects (useful for testing/reset)
 */
export const clearProjects = () => {
  projects = []
  nextId = 1
  saveProjects()
}

/**
 * Reload projects from localStorage
 */
export const reloadProjects = () => {
  loadProjects()
}

/**
 * Get projects count (useful for debugging)
 */
export const getProjectsCount = () => {
  return projects.length
}
