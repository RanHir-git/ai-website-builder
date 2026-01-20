/**
 * Base API service with common utilities
 * Handles authentication headers and error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Get authentication token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('token')
}

/**
 * Make an API request with automatic token handling
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text()

    if (!response.ok) {
      // If unauthorized, clear token
      if (response.status === 401) {
        localStorage.removeItem('token')
      }
      throw new Error(data.message || data || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

/**
 * GET request
 */
export const get = (endpoint) => apiRequest(endpoint, { method: 'GET' })

/**
 * POST request
 */
export const post = (endpoint, data) => 
  apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })

/**
 * PUT request
 */
export const put = (endpoint, data) =>
  apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

/**
 * DELETE request
 */
export const del = (endpoint) => apiRequest(endpoint, { method: 'DELETE' })

/**
 * PATCH request
 */
export const patch = (endpoint, data) =>
  apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
