const Team = require('../models/Team');

const exportTeamsToCSV = async (filters = {}) => {
  try {
    // Build query based on filters
    const query = {};
    
    if (filters.domain && filters.domain !== 'all') {
      query.domain = filters.domain;
    }
    
    if (filters.search) {
      query.$or = [
        { teamName: { $regex: filters.search, $options: 'i' } },
        { leaderName: { $regex: filters.search, $options: 'i' } },
        { college: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Get teams
    const teams = await Team.find(query).sort({ registeredAt: -1 });

    // CSV headers
    const headers = [
      'Team Name',
      'Leader Name',
      'Email',
      'Phone',
      'College',
      'Department',
      'Team Members',
      'Project Title',
      'Domain',
      'Description',
      'GitHub Link',
      'Registration Date'
    ];

    // Convert teams to CSV rows
    const csvRows = teams.map(team => {
      // Format team members as a string
      const membersList = [
        team.leaderName + ' (Leader)',
        ...team.members.map(member => member.name)
      ].join('; ');

      return [
        `"${team.teamName}"`,
        `"${team.leaderName}"`,
        `"${team.email}"`,
        `"${team.phone}"`,
        `"${team.college}"`,
        `"${team.department}"`,
        `"${membersList}"`,
        `"${team.projectTitle}"`,
        `"${team.domain}"`,
        `"${team.description.replace(/"/g, '""')}"`, // Escape quotes in description
        `"${team.githubLink}"`,
        `"${team.registeredAt.toISOString()}"`
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    return csvContent;
  } catch (error) {
    console.error('Error exporting teams to CSV:', error);
    throw new Error('Failed to export teams to CSV');
  }
};

module.exports = exportTeamsToCSV;
