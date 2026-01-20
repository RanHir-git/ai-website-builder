import mongoose from 'mongoose'

const versionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
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
versionSchema.index({ projectId: 1 })
versionSchema.index({ timestamp: 1 })

const Version = mongoose.model('Version', versionSchema)

export default Version
