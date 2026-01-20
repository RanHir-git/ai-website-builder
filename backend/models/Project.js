import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true,
  },
  initialPrompt: {
    type: String,
    required: [true, 'Please provide an initial prompt'],
  },
  currentCode: {
    type: String,
    default: '',
  },
  currentVersionIndex: {
    type: String,
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

// Index for faster queries
projectSchema.index({ userId: 1 })
projectSchema.index({ isPublished: 1 })

// Virtual for title (alias for name)
projectSchema.virtual('title').get(function() {
  return this.name
})

// Ensure virtuals are included in JSON
projectSchema.set('toJSON', { virtuals: true })

const Project = mongoose.model('Project', projectSchema)

export default Project
