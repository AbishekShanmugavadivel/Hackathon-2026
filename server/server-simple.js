import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Mock data for testing (without MongoDB)
let mockTeams = [
  {
    _id: '1',
    teamName: 'Code Warriors',
    collegeName: 'MIT Engineering College',
    domain: 'Web Development',
    members: [
      {
        name: 'John Doe',
        role: 'Team Leader',
        phone: '9876543210',
        email: 'john@mit.edu'
      },
      {
        name: 'Jane Smith',
        role: 'Developer',
        phone: '',
        email: ''
      }
    ],
    createdAt: new Date('2024-03-20')
  }
]

// API Routes
// POST /api/register - Register a new team
app.post('/api/register', (req, res) => {
  try {
    console.log('Registration request:', req.body)
    
    // Basic validation
    if (!req.body.teamName || !req.body.collegeName || !req.body.domain) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // Create new team
    const newTeam = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    }

    mockTeams.push(newTeam)
    
    res.status(201).json({
      success: true,
      message: 'Team registered successfully',
      data: newTeam
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
app.get('/api/students', (req, res) => {
  try {
    // Get query parameters for filtering
    const { domain, search, page = 1, limit = 50 } = req.query
    
    // Build query
    let filteredTeams = mockTeams
    
    if (domain && domain !== 'all') {
      filteredTeams = filteredTeams.filter(team => team.domain === domain)
    }
    
    if (search) {
      filteredTeams = filteredTeams.filter(team =>
        team.teamName.toLowerCase().includes(search.toLowerCase()) ||
        team.collegeName.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const paginatedTeams = filteredTeams.slice(skip, skip + parseInt(limit))

    res.status(200).json({
      success: true,
      data: paginatedTeams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredTeams.length,
        pages: Math.ceil(filteredTeams.length / parseInt(limit))
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

// DELETE /api/students/:id - Delete a team
app.delete('/api/students/:id', (req, res) => {
  try {
    const teamId = req.params.id
    mockTeams = mockTeams.filter(team => team._id !== teamId)
    
    res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
      data: { id: teamId }
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  })
})

// Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
    console.log(`📊 Mock data mode: No MongoDB connection required`)
  })
}

// Start the server
startServer().catch(error => {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
})

export default app
