/**
 * Authentication service
 * Handles all authentication-related API calls
 */

import { post, get } from './api'

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} User object with token
 */
export const login = async (credentials) => {
  const response = await post('/auth/login', credentials)
  
  // Store token if provided
  if (response.token) {
    localStorage.setItem('token', response.token)
  }
  
  // Return user object (extract from response if nested)
  return response.user || response
}

/**
 * Register new user
 * @param {Object} userData - { name, email, password, ... }
 * @returns {Promise<Object>} User object with token
 */
export const register = async (userData) => {
  const response = await post('/auth/register', userData)
  
  // Store token if provided
  if (response.token) {
    localStorage.setItem('token', response.token)
  }
  
  // Return user object (extract from response if nested)
  return response.user || response
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User object or null
 */
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const response = await get('/auth/me')
    // Backend returns { success: true, user: {...} }
    return response.user || response
  } catch (error) {
    // Token is invalid, clear it
    localStorage.removeItem('token')
    return null
  }
}

/**
 * Logout user
 * Clears token from localStorage
 * Optionally calls backend logout endpoint
 */
export const logout = async () => {
  const token = localStorage.getItem('token')
  
  // Optionally call backend logout endpoint
  if (token) {
    try {
      await post('/auth/logout')
    } catch (error) {
      // Even if logout fails, clear local token
      console.error('Logout error:', error)
    }
  }
  
  localStorage.removeItem('token')
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}
