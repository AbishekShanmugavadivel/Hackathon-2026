const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const {
  registerTeam,
  getAllTeams,
  getTeamById,
  deleteTeam,
  getStatistics
} = require('../controllers/teamController');
const authenticate = require('../middleware/authMiddleware');

// Validation middleware for team registration
const validateTeamRegistration = [
  body('teamName')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ max: 100 })
    .withMessage('Team name cannot exceed 100 characters'),
  
  body('leaderName')
    .trim()
    .notEmpty()
    .withMessage('Team leader name is required')
    .isLength({ max: 100 })
    .withMessage('Leader name cannot exceed 100 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please enter a valid phone number')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10-20 characters'),
  
  body('college')
    .trim()
    .notEmpty()
    .withMessage('College name is required')
    .isLength({ max: 200 })
    .withMessage('College name cannot exceed 200 characters'),
  
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required')
    .isLength({ max: 100 })
    .withMessage('Department cannot exceed 100 characters'),
  
  body('members')
    .isArray({ min: 1, max: 3 })
    .withMessage('Team must have 1-3 additional members (2-4 total members)'),
  
  body('members.*.name')
    .trim()
    .notEmpty()
    .withMessage('Member name is required')
    .isLength({ max: 100 })
    .withMessage('Member name cannot exceed 100 characters'),
  
  body('members.*.email')
    .isEmail()
    .withMessage('Please provide a valid member email')
    .normalizeEmail(),
  
  body('members.*.phone')
    .notEmpty()
    .withMessage('Member phone number is required')
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please enter a valid member phone number'),
  
  body('projectTitle')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 200 })
    .withMessage('Project title cannot exceed 200 characters'),
  
  body('domain')
    .isIn(['AI', 'Web', 'App', 'Cybersecurity'])
    .withMessage('Domain must be one of: AI, Web, App, Cybersecurity'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ min: 50, max: 1000 })
    .withMessage('Description must be between 50-1000 characters'),
  
  body('githubLink')
    .matches(/^https?:\/\/(www\.)?github\.com\/[\w\-._~:/?#[\]@!$&'()*+,;=]+$/)
    .withMessage('Please provide a valid GitHub URL'),
  
  body('agreedToRules')
    .isBoolean()
    .equals('true')
    .withMessage('You must agree to the rules and regulations')
];

// Public routes
router.post('/register', validateTeamRegistration, registerTeam);

// Protected routes (admin only)
router.use(authenticate); // Apply authentication to all routes below

router.get('/', getAllTeams);
router.get('/statistics', getStatistics);
router.get('/:id', getTeamById);
router.delete('/:id', deleteTeam);

module.exports = router;
