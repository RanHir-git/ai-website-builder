import dotenv from 'dotenv'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import User from '../models/User.js'
import Project from '../models/Project.js'
import Conversation from '../models/Conversation.js'
import Version from '../models/Version.js'
import { connectDB } from '../config/database.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Helper function to parse timestamp strings to Date objects
const parseTimestamp = (timestampStr) => {
  if (!timestampStr) return new Date()
  if (typeof timestampStr === 'object' && timestampStr instanceof Date) {
    return timestampStr
  }
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

const seedFromJSON = async () => {
  try {
    // Connect to database
    await connectDB()
    console.log('✅ Connected to MongoDB\n')

    // Check if JSON file exists
    const jsonPath = path.join(__dirname, '../data/dummyData.json')
    
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ dummyData.json not found!')
      console.log('\n📝 To create the JSON file:')
      console.log('   1. Create backend/data/dummyData.json')
      console.log('   2. Export your dummyUser and dummyProjects from assets.ts')
      console.log('   3. Format as JSON:\n')
      console.log('   {')
      console.log('     "user": { "name": "...", "email": "...", "password": "..." },')
      console.log('     "projects": [ ... ]')
      console.log('   }\n')
      process.exit(1)
    }

    // Read JSON file
    console.log('📖 Reading dummyData.json...')
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await User.deleteMany({})
    await Project.deleteMany({})
    await Conversation.deleteMany({})
    await Version.deleteMany({})
    console.log('✅ Existing data cleared\n')

    // Create user
    console.log('👤 Creating user...')
    // Support both 'user' and 'dummyUser' naming conventions
    const userData = jsonData.user || jsonData.dummyUser || {
      name: "GreatStack",
      email: 'test@greatstack.dev',
      password: 'password123',
      credits: 20,
      totalCreation: 0
    }
    
    const user = await User.create(userData)
    console.log(`✅ User created: ${user.email} (ID: ${user._id})\n`)

    // Create projects
    // Support both 'projects' and 'dummyProjects' naming conventions
    const projects = jsonData.projects || jsonData.dummyProjects || []
    console.log(`📦 Creating ${projects.length} project(s)...`)

    for (let i = 0; i < projects.length; i++) {
      const projectData = projects[i]
      const project = await Project.create(transformProject(projectData, user._id))
      console.log(`   ${i + 1}. Created: ${project.name}`)

      // Create conversations
      if (projectData.conversation && projectData.conversation.length > 0) {
        const conversations = projectData.conversation.map(conv => 
          transformConversation(conv, project._id)
        )
        await Conversation.insertMany(conversations)
        console.log(`      └─ ${conversations.length} conversation(s)`)
      }

      // Create versions
      if (projectData.versions && projectData.versions.length > 0) {
        const versions = projectData.versions.map(ver => 
          transformVersion(ver, project._id)
        )
        await Version.insertMany(versions)
        console.log(`      └─ ${versions.length} version(s)`)
      }
    }

    console.log('\n✅ Database seeded successfully!')
    console.log(`\n📧 Login credentials:`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Password: ${userData.password || 'password123'}`)
    console.log(`\n📊 Summary:`)
    console.log(`   Users: 1`)
    console.log(`   Projects: ${projects.length}`)
    
    const totalConversations = projects.reduce((sum, p) => sum + (p.conversation?.length || 0), 0)
    const totalVersions = projects.reduce((sum, p) => sum + (p.versions?.length || 0), 0)
    console.log(`   Conversations: ${totalConversations}`)
    console.log(`   Versions: ${totalVersions}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedFromJSON()
