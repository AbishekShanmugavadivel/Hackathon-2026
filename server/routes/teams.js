import express from 'express'
import Team from '../models/Team.js'
import { body, validationResult } from 'express-validator'
import validator from 'validator'

const router = express.Router()

// Validation middleware
const validateTeamRegistration = [
  body('teamName')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ max: 100 })
    .withMessage('Team name cannot exceed 100 characters'),
  
  body('collegeName')
    .trim()
    .notEmpty()
    .withMessage('College name is required')
    .isLength({ max: 150 })
    .withMessage('College name cannot exceed 150 characters'),
  
  body('domain')
    .trim()
    .notEmpty()
    .withMessage('Domain is required')
    .isIn(['Web Development', 'AI/ML', 'Cyber Security', 'IoT', 'Mobile App', 'Open Innovation'])
    .withMessage('Invalid domain selected'),
  
  body('members')
    .isArray({ min: 1, max: 4 })
    .withMessage('Team must have 1-4 members'),
  
  body('members.*.name')
    .trim()
    .notEmpty()
    .withMessage('Member name is required')
    .isLength({ max: 50 })
    .withMessage('Member name cannot exceed 50 characters'),
  
  body('members.*.role')
    .trim()
    .notEmpty()
    .withMessage('Member role is required')
    .isIn(['Team Leader', 'Developer', 'Designer', 'Presenter'])
    .withMessage('Invalid member role'),
  
  body('members.*.phone')
    .if(body('members.*.role').equals('Team Leader'))
    .trim()
    .notEmpty()
    .withMessage('Team Leader phone is required')
    .custom((value) => {
      if (!value || !/^\d{10}$/.test(value.replace(/\s/g, ''))) {
        throw new Error('Team Leader phone must be exactly 10 digits')
      }
      return true
    }),
  
  body('members.*.email')
    .if(body('members.*.role').equals('Team Leader'))
    .trim()
    .notEmpty()
    .withMessage('Team Leader email is required')
    .isEmail()
    .withMessage('Team Leader email must be valid')
]

// POST /api/register - Register a new team
router.post('/register', validateTeamRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    // Check if team name already exists
    const existingTeam = await Team.findOne({ 
      teamName: req.body.teamName.trim() 
    })
    
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Team name already exists'
      })
    }

    // Validate exactly one team leader
    const teamLeaders = req.body.members.filter(member => member.role === 'Team Leader')
    if (teamLeaders.length !== 1) {
      return res.status(400).json({
        success: false,
        message: 'Exactly one Team Leader is required'
      })
    }

    // Create new team
    const newTeam = new Team({
      teamName: req.body.teamName.trim(),
      collegeName: req.body.collegeName.trim(),
      domain: req.body.domain.trim(),
      members: req.body.members.map(member => ({
        name: member.name.trim(),
        role: member.role.trim(),
        phone: member.role === 'Team Leader' ? member.phone.trim() : '',
        email: member.role === 'Team Leader' ? member.email.trim().toLowerCase() : ''
      }))
    })

    // Save team to database
    const savedTeam = await newTeam.save()

    res.status(201).json({
      success: true,
      message: 'Team registered successfully',
      data: savedTeam
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    })
  }
})

// GET /api/students - Get all registered teams
router.get('/students', async (req, res) => {
  try {
    // Get query parameters for filtering
    const { domain, search, page = 1, limit = 50 } = req.query
    
    // Build query
    const query = {}
    
    if (domain && domain !== 'all') {
      query.domain = domain
    }
    
    if (search) {
      query.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { collegeName: { $regex: search, $options: 'i' } },
        { 'members.name': { $regex: search, $options: 'i' } }
      ]
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    // Fetch teams
    const teams = await Team.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    // Get total count for pagination
    const total = await Team.countDocuments(query)

    res.status(200).json({
      success: true,
      data: teams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('Fetch teams error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching teams',
      error: error.message
    })
  }
})

// GET /api/students/:id - Get specific team by ID
router.get('/students/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    res.status(200).json({
      success: true,
      data: team
    })

  } catch (error) {
    console.error('Fetch team error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team',
      error: error.message
    })
  }
})

// DELETE /api/students/:id - Delete a team (admin only)
router.delete('/students/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id)
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
      data: team
    })

  } catch (error) {
    console.error('Delete team error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting team',
      error: error.message
    })
  }
})

// GET /api/stats - Get registration statistics
router.get('/stats', async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments()
    
    const domainStats = await Team.aggregate([
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    const todayTeams = await Team.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    })

    res.status(200).json({
      success: true,
      data: {
        totalTeams,
        todayRegistrations: todayTeams,
        domainStats,
        activeDomains: domainStats.length
      }
    })

  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats',
      error: error.message
    })
  }
})

export default router
