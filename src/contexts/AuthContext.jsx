import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, logout as logoutService, login as loginService, register as registerService } from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const userData = await loginService(credentials)
      setUser(userData)
      return userData
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const newUser = await registerService(userData)
      setUser(newUser)
      return newUser
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    await logoutService()
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser((prevUser) => ({ ...prevUser, ...userData }))
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
