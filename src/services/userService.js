/**
 * User Service
 * Handles user-related API calls
 */

import { get } from './api'

/**
 * Get user credits
 * @returns {Promise<Object>} User credits object
 */
export const getUserCredits = async () => {
  const response = await get('/user/credits')
  return response.data
}
