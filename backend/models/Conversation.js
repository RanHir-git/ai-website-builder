import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

// Index for faster queries
conversationSchema.index({ projectId: 1 })
conversationSchema.index({ timestamp: 1 })

const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation
