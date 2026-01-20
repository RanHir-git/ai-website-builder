/**
 * Data Service
 * Handles syncing between localStorage and JSON files in public/data folder
 */

const USERS_STORAGE_KEY = 'users'
const PROJECTS_STORAGE_KEY = 'projects'

/**
 * Load JSON file from public/data folder
 * @param {string} filename - Name of the JSON file (without .json extension)
 * @returns {Promise<Object|Array|null>} Parsed JSON data or null
 */
const loadJSONFile = async (filename) => {
  try {
    const response = await fetch(`/data/${filename}.json`)
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch (error) {
    console.error(`Failed to load ${filename}.json:`, error)
    return null
  }
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {Object|Array} data - Data to save
 */
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error)
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @returns {Object|Array|null} Parsed data or null
 */
const loadFromLocalStorage = (key) => {
  try {
    const dataStr = localStorage.getItem(key)
    if (dataStr) {
      return JSON.parse(dataStr)
    }
    return null
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error)
    return null
  }
}

/**
 * Initialize data from JSON files if localStorage is empty
 * This should be called on app startup
 */
export const initializeData = async () => {
  // Check if localStorage already has data
  const existingUsers = loadFromLocalStorage(USERS_STORAGE_KEY)
  const existingProjects = loadFromLocalStorage(PROJECTS_STORAGE_KEY)

  // If localStorage is empty, load from JSON files
  if (!existingUsers || existingUsers.length === 0) {
    const usersData = await loadJSONFile('users')
    if (usersData && Array.isArray(usersData)) {
      saveToLocalStorage(USERS_STORAGE_KEY, usersData)
    }
  }

  if (!existingProjects || existingProjects.length === 0) {
    const projectsData = await loadJSONFile('projects')
    if (projectsData && Array.isArray(projectsData)) {
      saveToLocalStorage(PROJECTS_STORAGE_KEY, projectsData)
    }
  }
}

/**
 * Get users from localStorage
 * @returns {Array} Array of users
 */
export const getUsers = () => {
  return loadFromLocalStorage(USERS_STORAGE_KEY) || []
}

/**
 * Save users to localStorage
 * @param {Array} users - Array of user objects
 */
export const saveUsers = (users) => {
  saveToLocalStorage(USERS_STORAGE_KEY, users)
}

/**
 * Get projects from localStorage
 * @returns {Array} Array of projects
 */
export const getProjects = () => {
  return loadFromLocalStorage(PROJECTS_STORAGE_KEY) || []
}

/**
 * Save projects to localStorage
 * @param {Array} projects - Array of project objects
 */
export const saveProjects = (projects) => {
  saveToLocalStorage(PROJECTS_STORAGE_KEY, projects)
}

/**
 * Export data as JSON file (download)
 * @param {string} filename - Name of the file
 * @param {Object|Array} data - Data to export
 */
export const exportData = (filename, data) => {
  try {
    const dataStr = JSON.stringify(data, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(`Failed to export ${filename}:`, error)
  }
}
