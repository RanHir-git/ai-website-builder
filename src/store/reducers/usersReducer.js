import { createSlice } from '@reduxjs/toolkit'
import * as usersActions from '../actions/usersActions'

const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    // Set error
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    // Set all users
    setUsers: (state, action) => {
      state.users = action.payload
      state.loading = false
      state.error = null
    },
    // Add new user
    addUser: (state, action) => {
      state.users.push(action.payload)
    },
    // Update existing user
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
      // Update current user if it's the same user
      if (state.currentUser && state.currentUser.id === action.payload.id) {
        state.currentUser = action.payload
      }
    },
    // Delete user
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload)
      // Clear current user if deleted user is current user
      if (state.currentUser && state.currentUser.id === action.payload) {
        state.currentUser = null
        state.isAuthenticated = false
      }
    },
    // Set current user (login)
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
      state.isAuthenticated = !!action.payload
    },
    // Logout
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
    },
    // Update current user profile
    updateCurrentUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload }
      // Also update in users array
      const index = state.users.findIndex(user => user.id === state.currentUser.id)
      if (index !== -1) {
        state.users[index] = state.currentUser
      }
    },
  },
})

export const {
  setLoading,
  setError,
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setCurrentUser,
  logout,
  updateCurrentUser,
} = usersSlice.actions

export default usersSlice.reducer
