import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  credits: {
    type: Number,
    default: 20,
  },
  totalCreation: {
    type: Number,
    default: 0,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Method to return user without password
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  return user
}

const User = mongoose.model('User', userSchema)

export default User
