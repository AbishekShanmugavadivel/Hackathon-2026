import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    maxlength: [100, 'Team name cannot exceed 100 characters']
  },
  collegeName: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
    maxlength: [150, 'College name cannot exceed 150 characters']
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    enum: ['Web Development', 'AI/ML', 'Cyber Security', 'IoT', 'Mobile App', 'Open Innovation'],
    trim: true
  },
  members: {
    type: [{
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Member name cannot exceed 50 characters']
      },
      role: {
        type: String,
        required: true,
        enum: ['Team Leader', 'Developer', 'Designer', 'Presenter'],
        trim: true
      },
      phone: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            // Phone is only required for Team Leader
            if (this.role === 'Team Leader') {
              return v && /^\d{10}$/.test(v.replace(/\s/g, ''))
            }
            return true
          },
          message: 'Team Leader phone must be 10 digits'
        }
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: function(v) {
            // Email is only required for Team Leader
            if (this.role === 'Team Leader') {
              return v && /^\S+@\S+\.\S+$/.test(v)
            }
            return true
          },
          message: 'Team Leader email must be valid'
        }
      }
    }],
    required: [true, 'At least one member is required'],
    validate: {
      validator: function(members) {
        return members && members.length >= 1 && members.length <= 4
      },
      message: 'Team must have 1-4 members'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Add virtual for team leader
teamSchema.virtual('teamLeader').get(function() {
  return this.members.find(member => member.role === 'Team Leader')
})

// Add index for better query performance
teamSchema.index({ teamName: 1 })
teamSchema.index({ collegeName: 1 })
teamSchema.index({ domain: 1 })
teamSchema.index({ createdAt: -1 })

const Team = mongoose.model('Team', teamSchema)

export default Team
