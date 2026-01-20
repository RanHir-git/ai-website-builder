/**
 * User Service
 * Business logic for user operations
 */

import User from '../../models/User.js'

/**
 * Get user credits by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User credits object
 */
export const getUserCredits = async (userId) => {
  const user = await User.findById(userId).select('credits totalCreation')

  if (!user) {
    throw new Error('User not found')
  }

  return {
    credits: user.credits,
    totalCreation: user.totalCreation,
  }
}

/**
 * Get user profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password')

  if (!user) {
    throw new Error('User not found')
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    credits: user.credits,
    totalCreation: user.totalCreation,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

/**
 * Update user credits
 * @param {string} userId - User ID
 * @param {number} credits - New credits value
 * @returns {Promise<Object>} Updated user credits
 */
export const updateUserCredits = async (userId, credits) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  user.credits = credits
  await user.save()

  return {
    credits: user.credits,
    totalCreation: user.totalCreation,
  }
}

/**
 * Increment user credits
 * @param {string} userId - User ID
 * @param {number} amount - Amount to add
 * @returns {Promise<Object>} Updated user credits
 */
export const incrementUserCredits = async (userId, amount) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  user.credits += amount
  await user.save()

  return {
    credits: user.credits,
    totalCreation: user.totalCreation,
  }
}

/**
 * Decrement user credits
 * @param {string} userId - User ID
 * @param {number} amount - Amount to subtract
 * @returns {Promise<Object>} Updated user credits
 */
export const decrementUserCredits = async (userId, amount) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  if (user.credits < amount) {
    throw new Error('Insufficient credits')
  }

  user.credits -= amount
  await user.save()

  return {
    credits: user.credits,
    totalCreation: user.totalCreation,
  }
}

/**
 * Increment total creation count
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated user stats
 */
export const incrementTotalCreation = async (userId) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  user.totalCreation += 1
  await user.save()

  return {
    credits: user.credits,
    totalCreation: user.totalCreation,
  }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user object
 */
export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  // Allowed fields to update
  const allowedFields = ['name', 'email']
  const updates = {}

  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field]
    }
  })

  Object.assign(user, updates)
  await user.save()

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    credits: user.credits,
    totalCreation: user.totalCreation,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}
