const Team = require('../models/Team');

// Register a new team
const registerTeam = async (req, res, next) => {
  try {
    const teamData = req.body;

    // Create new team
    const team = new Team(teamData);
    await team.save();

    res.status(201).json({
      success: true,
      message: 'Team registered successfully!',
      data: {
        id: team._id,
        teamName: team.teamName,
        leaderName: team.leaderName,
        email: team.email,
        registeredAt: team.registeredAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all teams (admin only)
const getAllTeams = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      domain = '', 
      sortBy = 'registeredAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build query
    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { leaderName: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by domain
    if (domain) {
      query.domain = domain;
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [teams, total] = await Promise.all([
      Team.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Team.countDocuments(query)
    ]);

    // Pagination info
    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalTeams: total,
      teamsPerPage: parseInt(limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    };

    res.status(200).json({
      success: true,
      data: teams,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

// Get single team by ID
const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// Delete a team (admin only)
const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
      data: {
        id: team._id,
        teamName: team.teamName
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get statistics (admin only)
const getStatistics = async (req, res, next) => {
  try {
    const [
      totalTeams,
      domainStats,
      recentRegistrations
    ] = await Promise.all([
      Team.countDocuments(),
      Team.aggregate([
        {
          $group: {
            _id: '$domain',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]),
      Team.find()
        .sort({ registeredAt: -1 })
        .limit(5)
        .select('teamName leaderName college domain registeredAt')
    ]);

    // Get registrations by date for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRegistrations = await Team.aggregate([
      {
        $match: {
          registeredAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$registeredAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTeams,
        domainStats,
        recentRegistrations,
        dailyRegistrations
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerTeam,
  getAllTeams,
  getTeamById,
  deleteTeam,
  getStatistics
};
