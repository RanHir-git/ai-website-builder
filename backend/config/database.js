import mongoose from 'mongoose'

/**
 * Connect to MongoDB database
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not set in environment variables!')
      console.error('Please set MONGODB_URI in your Render environment variables.')
      process.exit(1)
    }
    
    console.log('🔌 Attempting to connect to MongoDB...')
    console.log(`📍 Connection string: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`) // Hide credentials
    
    const conn = await mongoose.connect(mongoURI)
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:')
    console.error(`   Message: ${error.message}`)
    console.error(`   Code: ${error.code || 'N/A'}`)
    
    // Provide helpful error messages
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Tip: Check your MongoDB username and password in the connection string')
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Tip: Check your MongoDB cluster URL is correct')
    } else if (error.message.includes('IP')) {
      console.error('\n💡 Tip: Add Render IPs to MongoDB Atlas Network Access whitelist (0.0.0.0/0)')
    }
    
    process.exit(1)
  }
}
