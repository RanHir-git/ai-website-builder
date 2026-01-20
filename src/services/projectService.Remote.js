/**
 * Project service - Backend version (Node.js + Express)
 * Handles all project-related API calls using AJAX (XMLHttpRequest)
 */

// Use relative URL for same-origin deployment, or absolute URL if VITE_API_URL is set
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api')

/**
 * Get authentication token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('token')
}

/**
 * Make an AJAX request using XMLHttpRequest
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} data - Request body data (optional)
 * @returns {Promise} Promise that resolves with response data
 */
const ajaxRequest = (endpoint, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const url = `${API_BASE_URL}${endpoint}`
    
    xhr.open(method, url, true)
    
    // Set headers
    xhr.setRequestHeader('Content-Type', 'application/json')
    const token = getToken()
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    
    // Handle response
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const contentType = xhr.getResponseHeader('content-type')
          let responseData
          
          if (contentType && contentType.includes('application/json')) {
            responseData = JSON.parse(xhr.responseText)
          } else {
            responseData = xhr.responseText
          }
          
          resolve(responseData)
        } catch (error) {
          reject(new Error('Failed to parse response'))
        }
      } else {
        // Handle error response
        if (xhr.status === 401) {
          localStorage.removeItem('token')
        }
        
        try {
          const errorData = JSON.parse(xhr.responseText)
          reject(new Error(errorData.message || `HTTP error! status: ${xhr.status}`))
        } catch {
          reject(new Error(`HTTP error! status: ${xhr.status}`))
        }
      }
    }
    
    // Handle network errors
    xhr.onerror = function() {
      reject(new Error('Network error occurred'))
    }
    
    // Handle timeout
    xhr.ontimeout = function() {
      reject(new Error('Request timeout'))
    }
    
    // Set timeout (120 seconds for AI generation which can take longer)
    xhr.timeout = 120000
    
    // Send request
    if (data) {
      xhr.send(JSON.stringify(data))
    } else {
      xhr.send()
    }
  })
}

/**
 * Get all projects for the current user
 * Backend should return projects with user information included
 * Expected project structure: { id, name, description, userId, user: { id, name, email, ... }, ... }
 * @returns {Promise<Array>} Array of projects (each project includes user information)
 */
export const getProjects = async () => {
  return await ajaxRequest('/projects', 'GET')
}

/**
 * Get a single project by ID
 * Backend should return project with user information included
 * Expected project structure: { id, name, description, userId, user: { id, name, email, ... }, ... }
 * @param {string|number} projectId
 * @returns {Promise<Object>} Project object (includes user information)
 */
export const getProject = async (projectId) => {
  return await ajaxRequest(`/projects/${projectId}`, 'GET')
}

/**
 * Create a new project
 * Backend should automatically associate the project with the current user (from token)
 * Backend should return the created project with user information included
 * @param {Object} projectData - { name, description, ... } (userId will be set by backend from token)
 * @returns {Promise<Object>} Created project (includes user information)
 */
export const createProject = async (projectData) => {
  return await ajaxRequest('/projects', 'POST', projectData)
}

/**
 * Update a project
 * Backend should verify the project belongs to the current user (from token)
 * Backend should return the updated project with user information included
 * @param {string|number} projectId
 * @param {Object} projectData - Updated project data (userId should not be changed)
 * @returns {Promise<Object>} Updated project (includes user information)
 */
export const updateProject = async (projectId, projectData) => {
  return await ajaxRequest(`/projects/${projectId}`, 'PUT', projectData)
}

/**
 * Get all community projects (published projects from all users)
 * Backend should return published projects with user information included
 * @returns {Promise<Array>} Array of published projects (each project includes user information)
 */
export const getCommunityProjects = async () => {
  return await ajaxRequest('/projects/community', 'GET')
}

/**
 * Delete a project
 * Backend should verify the project belongs to the current user (from token)
 * @param {string|number} projectId
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId) => {
  return await ajaxRequest(`/projects/${projectId}`, 'DELETE')
}

/**
 * Toggle publish status of a project
 * Backend should verify the project belongs to the current user (from token)
 * @param {string|number} projectId
 * @returns {Promise<Object>} Updated project with new publish status
 */
export const togglePublish = async (projectId) => {
  return await ajaxRequest(`/projects/${projectId}/publish`, 'PATCH')
}
