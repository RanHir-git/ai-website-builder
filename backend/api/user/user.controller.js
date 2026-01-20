/**
 * User Controller
 * Handles HTTP requests and responses for user operations
 */

import * as userService from './user.service.js'

/**
 * @desc    Get user credits
 * @route   GET /api/user/credits
 * @access  Private
 */
export const getUserCredits = async (req, res, next) => {
  try {
    const userId = req.user._id

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const credits = await userService.getUserCredits(userId)

    res.json({
      success: true,
      data: credits,
    })
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const profile = await userService.getUserProfile(userId)

    res.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * @desc    Update user credits
 * @route   PUT /api/user/credits
 * @access  Private
 */
export const updateUserCredits = async (req, res, next) => {
  try {
    const userId = req.user._id
    const { credits } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    if (typeof credits !== 'number' || credits < 0) {
      return res.status(400).json({
        success: false,
        message: 'Credits must be a positive number',
      })
    }

    const updatedCredits = await userService.updateUserCredits(userId, credits)

    res.json({
      success: true,
      data: updatedCredits,
      message: 'Credits updated successfully',
    })
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * @desc    Increment user credits
 * @route   PATCH /api/user/credits/increment
 * @access  Private
 */
export const incrementUserCredits = async (req, res, next) => {
  try {
    const userId = req.user._id
    const { amount } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      })
    }

    const updatedCredits = await userService.incrementUserCredits(userId, amount)

    res.json({
      success: true,
      data: updatedCredits,
      message: 'Credits incremented successfully',
    })
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * @desc    Decrement user credits
 * @route   PATCH /api/user/credits/decrement
 * @access  Private
 */
export const decrementUserCredits = async (req, res, next) => {
  try {
    const userId = req.user._id
    const { amount } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      })
    }

    const updatedCredits = await userService.decrementUserCredits(userId, amount)

    res.json({
      success: true,
      data: updatedCredits,
      message: 'Credits decremented successfully',
    })
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    if (error.message === 'Insufficient credits') {
      return res.status(400).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * @desc    Increment total creation count
 * @route   PATCH /api/user/creation/increment
 * @access  Private
 */
export const incrementTotalCreation = async (req, res, next) => {
  try {
    const userId = req.user._id

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const stats = await userService.incrementTotalCreation(userId)

    res.json({
      success: true,
      data: stats,
      message: 'Total creation incremented successfully',
    })
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id
    const { name, email } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const updatedProfile = await userService.updateUserProfile(userId, { name, email })

    res.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }
    // Handle duplicate email error
    if (error.code === 11000 || error.message.includes('duplicate')) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      })
    }
    next(error)
  }
}
