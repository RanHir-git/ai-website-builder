import { setLoading, setError, setUsers, addUser, updateUser, deleteUser, setCurrentUser, logout, updateCurrentUser } from '../reducers/usersReducer'

/**
 * Fetch all users (async action)
 * Usage: dispatch(fetchUsers())
 */
export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    
    // Replace with your API call
    const response = await fetch('/api/users')
    if (!response.ok) throw new Error('Failed to fetch users')
    
    const data = await response.json()
    dispatch(setUsers(data))
  } catch (error) {
    dispatch(setError(error.message))
  }
}

/**
 * Login user
 * Usage: dispatch(loginUser({ email: 'user@example.com', password: 'password' }))
 */
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    
    // Replace with your API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    
    if (!response.ok) throw new Error('Login failed')
    
    const user = await response.json()
    dispatch(setCurrentUser(user))
    
    // Store token if provided
    if (user.token) {
      localStorage.setItem('token', user.token)
    }
    
    return user
  } catch (error) {
    dispatch(setError(error.message))
    throw error
  }
}

/**
 * Register new user
 * Usage: dispatch(registerUser({ name: 'John', email: 'john@example.com', password: 'password' }))
 */
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    
    // Replace with your API call
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    
    if (!response.ok) throw new Error('Registration failed')
    
    const newUser = await response.json()
    dispatch(addUser(newUser))
    dispatch(setCurrentUser(newUser))
    
    // Store token if provided
    if (newUser.token) {
      localStorage.setItem('token', newUser.token)
    }
    
    return newUser
  } catch (error) {
    dispatch(setError(error.message))
    throw error
  }
}

/**
 * Logout user
 * Usage: dispatch(logoutUser())
 */
export const logoutUser = () => async (dispatch) => {
  try {
    // Clear token from localStorage
    localStorage.removeItem('token')
    
    // Call logout API if needed
    // await fetch('/api/auth/logout', { method: 'POST' })
    
    dispatch(logout())
  } catch (error) {
    dispatch(setError(error.message))
  }
}

/**
 * Update user profile
 * Usage: dispatch(updateUserProfile({ id: 1, name: 'New Name' }))
 */
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    
    // Replace with your API call
    const response = await fetch(`/api/users/${userData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    
    if (!response.ok) throw new Error('Failed to update user')
    
    const updatedUser = await response.json()
    dispatch(updateUser(updatedUser))
    
    // Update current user if it's the same user
    // Note: This requires getState, which is available in thunk
    // If using this pattern, make sure to use it correctly
    
    return updatedUser
  } catch (error) {
    dispatch(setError(error.message))
    throw error
  }
}

/**
 * Delete user
 * Usage: dispatch(deleteUserById(1))
 */
export const deleteUserById = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    
    // Replace with your API call
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) throw new Error('Failed to delete user')
    
    dispatch(deleteUser(userId))
  } catch (error) {
    dispatch(setError(error.message))
    throw error
  }
}

/**
 * Get current user from token (on app load)
 * Usage: dispatch(getCurrentUser())
 */
export const getCurrentUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    
    dispatch(setLoading(true))
    
    // Replace with your API call
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      localStorage.removeItem('token')
      return null
    }
    
    const user = await response.json()
    dispatch(setCurrentUser(user))
    return user
  } catch (error) {
    localStorage.removeItem('token')
    dispatch(setError(error.message))
    return null
  }
}
