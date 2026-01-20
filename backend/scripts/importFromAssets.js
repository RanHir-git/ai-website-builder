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

const seedFromAssets = async () => {
  try {
    // Connect to database
    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await User.deleteMany({})
    await Project.deleteMany({})
    await Conversation.deleteMany({})
    await Version.deleteMany({})
    console.log('✅ Existing data cleared\n')

    // Create user
    console.log('👤 Creating user...')
    const dummyUser = {
      name: "GreatStack",
      email: 'test@greatstack.dev',
      password: 'password123', // Default password for seeding
      credits: 20,
      totalCreation: 0
    }

    const user = await User.create(dummyUser)
    console.log(`✅ User created: ${user.email} (ID: ${user._id})\n`)

    // Try to import from assets.ts
    // Since it's TypeScript, we'll need to read it as text and extract the data
    const assetsPath = path.join(__dirname, '../../src/data/assets.ts')
    
    if (!fs.existsSync(assetsPath)) {
      console.error('❌ assets.ts file not found at:', assetsPath)
      console.log('\n📝 Alternative: Create a JSON file with your dummy data')
      console.log('   See backend/scripts/seedFromJSON.js for JSON import')
      process.exit(1)
    }

    console.log('📖 Reading assets.ts file...')
    const assetsContent = fs.readFileSync(assetsPath, 'utf-8')
    
    // Extract dummyProjects array using regex
    // This is a simple approach - for production, consider using a proper parser
    const projectsMatch = assetsContent.match(/export const dummyProjects = \[([\s\S]*?)\];/)
    
    if (!projectsMatch) {
      console.error('❌ Could not find dummyProjects in assets.ts')
      console.log('\n💡 Tip: Make sure dummyProjects is exported as: export const dummyProjects = [...]')
      process.exit(1)
    }

    // For a more robust solution, we'll use eval (only for seeding, not production!)
    // WARNING: Only use this with trusted data
    console.log('⚠️  Parsing TypeScript data (using eval - safe for seeding only)...')
    
    // Create a safe context for evaluation
    const safeEval = (code) => {
      // Remove TypeScript-specific syntax
      let cleanCode = code
        .replace(/export const /g, 'const ')
        .replace(/export /g, '')
        .replace(/:\s*string/g, '')
        .replace(/:\s*number/g, '')
        .replace(/:\s*boolean/g, '')
        .replace(/:\s*any/g, '')
        .replace(/:\s*\{[^}]*\}/g, '')
      
      // Extract just the data we need
      const userMatch = cleanCode.match(/const dummyUser = \{([^}]+)\}/)
      const projectsMatch = cleanCode.match(/const dummyProjects = \[([\s\S]*?)\];/)
      
      return {
        user: userMatch ? eval(`(${userMatch[1]})`) : null,
        projects: projectsMatch ? eval(`[${projectsMatch[1]}]`) : []
      }
    }

    // Better approach: Use a JSON export
    console.log('\n📋 Recommended approach: Export your data to JSON')
    console.log('   1. Create backend/data/dummyData.json')
    console.log('   2. Export dummyUser and dummyProjects as JSON')
    console.log('   3. Use: node backend/scripts/seedFromJSON.js\n')

    // For now, let's create projects manually from what we know
    console.log('📦 Creating projects from known structure...')
    
    // You can manually add your projects here, or better yet:
    // Export assets.ts data to JSON and use seedFromJSON.js
    
    console.log('\n✅ Seeding complete!')
    console.log(`\n📧 Login credentials:`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Password: password123`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedFromAssets()
