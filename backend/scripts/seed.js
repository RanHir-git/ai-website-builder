import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Project from '../models/Project.js'
import Conversation from '../models/Conversation.js'
import Version from '../models/Version.js'
import { connectDB } from '../config/database.js'

// Import dummy data from assets.ts
// Note: We'll need to read the file and parse it, or convert it to JSON
// For now, I'll create a script that reads from a JSON file or directly imports

dotenv.config()

// Dummy user data (from assets.ts)
const dummyUser = {
  name: "GreatStack",
  email: 'test@greatstack.dev',
  password: 'password123', // Default password for seeding
  credits: 20,
  totalCreation: 0
}

// Helper function to parse timestamp strings to Date objects
const parseTimestamp = (timestampStr) => {
  if (!timestampStr) return new Date()
  // Handle format: '2025-11-14 10:51:14.997' or ISO format
  if (timestampStr.includes('T')) {
    return new Date(timestampStr)
  }
  // Convert 'YYYY-MM-DD HH:mm:ss.sss' to ISO format
  const [datePart, timePart] = timestampStr.split(' ')
  if (datePart && timePart) {
    return new Date(`${datePart}T${timePart}Z`)
  }
  return new Date(timestampStr)
}

// Transform project data from assets.ts format to database format
const transformProject = (projectData, userId) => {
  return {
    name: projectData.name,
    initialPrompt: projectData.initial_prompt || projectData.initialPrompt,
    currentCode: projectData.current_code || projectData.currentCode || '',
    currentVersionIndex: projectData.current_version_index || projectData.currentVersionIndex || '',
    userId: userId,
    isPublished: projectData.isPublished !== undefined ? projectData.isPublished : false,
    createdAt: projectData.createdAt ? parseTimestamp(projectData.createdAt) : new Date(),
    updatedAt: projectData.updatedAt ? parseTimestamp(projectData.updatedAt) : new Date(),
  }
}

// Transform conversation data
const transformConversation = (convData, projectId) => {
  return {
    role: convData.role,
    content: convData.content,
    projectId: projectId,
    timestamp: convData.timestamp ? parseTimestamp(convData.timestamp) : new Date(),
  }
}

// Transform version data
const transformVersion = (verData, projectId) => {
  return {
    code: verData.code || '',
    description: verData.description || '',
    projectId: projectId,
    timestamp: verData.timestamp ? parseTimestamp(verData.timestamp) : new Date(),
  }
}

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...')
    await User.deleteMany({})
    await Project.deleteMany({})
    await Conversation.deleteMany({})
    await Version.deleteMany({})
    console.log('Existing data cleared')

    // Create user
    console.log('Creating user...')
    const user = await User.create(dummyUser)
    console.log(`User created: ${user.email} (ID: ${user._id})`)

    // Import dummy projects
    // Since assets.ts is a TypeScript file, we'll need to read it differently
    // For now, let's create a way to import the data
    
    // Option 1: Read from a JSON export of the data
    // Option 2: Import directly if we convert assets.ts to a JS module
    
    // For this script, I'll show you how to import it programmatically
    // You'll need to either:
    // 1. Export the data from assets.ts to a JSON file
    // 2. Or modify this script to import from assets.ts directly
    
    console.log('\n⚠️  IMPORTANT: To seed projects, you need to:')
    console.log('1. Export dummyProjects from assets.ts to a JSON file, OR')
    console.log('2. Modify this script to import directly from assets.ts')
    console.log('\nFor now, creating a sample project...')

    // Create a sample project to demonstrate
    const sampleProject = {
      name: 'Sample Developer Portfolio',
      initial_prompt: 'create a developer portfolio website with all sections and animations',
      current_code: '<html><body><h1>Sample Portfolio</h1></body></html>',
      current_version_index: '',
      isPublished: true,
      conversation: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'create a developer portfolio website with all sections and animations',
          timestamp: '2025-12-01 10:00:00.000'
        }
      ],
      versions: [],
      createdAt: '2025-12-01 10:00:00.000',
      updatedAt: '2025-12-01 10:00:00.000'
    }

    const project = await Project.create(transformProject(sampleProject, user._id))
    console.log(`Sample project created: ${project.name} (ID: ${project._id})`)

    // Create conversations for the project
    if (sampleProject.conversation && sampleProject.conversation.length > 0) {
      const conversations = sampleProject.conversation.map(conv => 
        transformConversation(conv, project._id)
      )
      await Conversation.insertMany(conversations)
      console.log(`Created ${conversations.length} conversation(s)`)
    }

    // Create versions for the project
    if (sampleProject.versions && sampleProject.versions.length > 0) {
      const versions = sampleProject.versions.map(ver => 
        transformVersion(ver, project._id)
      )
      await Version.insertMany(versions)
      console.log(`Created ${versions.length} version(s)`)
    }

    console.log('\n✅ Database seeded successfully!')
    console.log(`\nUser: ${user.email}`)
    console.log(`Password: password123`)
    console.log(`\nYou can now login with these credentials.`)

    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
