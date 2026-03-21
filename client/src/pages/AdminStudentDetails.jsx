import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye,
  LogOut,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
  ArrowRight,
  Phone,
  Mail,
  Building,
  Crown,
  Code,
  Palette,
  Presentation
} from 'lucide-react'
import Loader from '../components/Loader'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { useTeamRegistration } from '../context/TeamRegistrationContext'

const AdminStudentDetails = () => {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()
  const { getFullTeams, deleteTeam, loading: contextLoading } = useTeamRegistration()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [selectedTeam, setSelectedTeam] = useState(null)

  const domains = ['all', 'Web Development', 'AI/ML', 'Cyber Security', 'IoT', 'Mobile App', 'Open Innovation']

  const roleIcons = {
    'Team Leader': Crown,
    'Developer': Code,
    'Designer': Palette,
    'Presenter': Presentation
  }

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true)
        const fullTeams = getFullTeams()
        setTeams(fullTeams)
      } catch (error) {
        console.error('Error loading teams:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
  }, [getFullTeams])

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return
    }

    try {
      await deleteTeam(teamId)
      setSelectedTeam(null)
    } catch (error) {
      console.error('Error deleting team:', error)
    }
  }

  const handleViewDetails = (team) => {
    setSelectedTeam(team)
  }

  const filteredTeams = teams.filter(team => {
    const matchesSearch = searchTerm === '' || 
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members.some(member => member.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDomain = selectedDomain === 'all' || team.domain === selectedDomain
    
    return matchesSearch && matchesDomain
  })

  const domainStats = domains.slice(1).map(domain => ({
    name: domain,
    count: teams.filter(t => t.domain === domain).length
  }))

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading team details..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Admin Student Details</h1>
            <p className="text-codix-gold/70">Full team member information and management</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="btn-secondary flex items-center"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Dashboard
            </button>
            <button
              onClick={logout}
              className="btn-secondary flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-gold"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-codix-gold/70 text-sm">Total Teams</p>
                <p className="text-2xl font-bold text-codix-gold">{teams.length}</p>
              </div>
              <Users className="h-8 w-8 text-codix-gold" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card-gold"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-codix-gold/70 text-sm">Total Members</p>
                <p className="text-2xl font-bold text-codix-gold">
                  {teams.reduce((total, team) => total + team.members.length, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-codix-gold" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-gold"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-codix-gold/70 text-sm">Top Domain</p>
                <p className="text-2xl font-bold text-codix-gold">
                  {domainStats.reduce((max, stat) => stat.count > max.count ? stat : max, { count: 0 }).name || 'N/A'}
                </p>
              </div>
              <Award className="h-8 w-8 text-codix-gold" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card-gold"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-codix-gold/70 text-sm">Team Leaders</p>
                <p className="text-2xl font-bold text-codix-gold">
                  {teams.length}
                </p>
              </div>
              <Crown className="h-8 w-8 text-codix-gold" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="card-gold p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-codix-gold/50" />
                <input
                  type="text"
                  placeholder="Search by team, college, or member name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Domain Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-codix-gold" />
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="input-field"
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain === 'all' ? 'All Domains' : domain}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Teams Grid with Full Details */}
        {filteredTeams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="h-16 w-16 text-codix-gold/50 mx-auto mb-4" />
            <p className="text-codix-gold/70">No teams found</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-gold p-6 hover:scale-105 transition-transform duration-300"
              >
                {/* Team Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-codix-gold">{team.teamName}</h3>
                    <p className="text-codix-gold/70">{team.collegeName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-codix-blue/20 text-codix-gold rounded-full text-sm">
                      {team.domain}
                    </span>
                    <button
                      onClick={() => handleViewDetails(team)}
                      className="p-2 text-codix-gold hover:bg-codix-gold/20 rounded transition-colors duration-300"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-2 text-red-500 hover:bg-red-500/20 rounded transition-colors duration-300"
                      title="Delete Team"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Team Members */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-codix-gold">Team Members</h4>
                  {team.members.map((member, memberIndex) => {
                    const RoleIcon = roleIcons[member.role] || Users
                    return (
                      <div
                        key={memberIndex}
                        className={`p-4 rounded-lg border ${
                          member.role === 'Team Leader'
                            ? 'bg-codix-gold/10 border-codix-gold/30'
                            : 'bg-codix-blue/10 border-codix-blue/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <RoleIcon className={`h-4 w-4 ${
                              member.role === 'Team Leader' ? 'text-codix-gold' : 'text-codix-gold/70'
                            }`} />
                            <span className="font-medium text-codix-light">{member.name}</span>
                            {member.role === 'Team Leader' && (
                              <span className="px-2 py-1 bg-codix-gold/20 text-codix-gold rounded-full text-xs">
                                Leader
                              </span>
                            )}
                          </div>
                          <span className="text-codix-gold/70 text-sm">{member.role}</span>
                        </div>
                        
                        {/* Show contact details only for team leader */}
                        {member.role === 'Team Leader' && (
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3 text-codix-gold/50" />
                              <span className="text-codix-gold/70">{member.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3 w-3 text-codix-gold/50" />
                              <span className="text-codix-gold/70">{member.email}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Team Details Modal */}
        {selectedTeam && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-gold max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-codix-gold">{selectedTeam.teamName}</h3>
                    <p className="text-codix-gold/70">{selectedTeam.collegeName}</p>
                    <span className="px-3 py-1 bg-codix-blue/20 text-codix-gold rounded-full text-sm">
                      {selectedTeam.domain}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteTeam(selectedTeam.id)}
                      className="p-2 text-red-500 hover:bg-red-500/20 rounded transition-colors duration-300"
                      title="Delete Team"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setSelectedTeam(null)}
                      className="p-2 text-codix-gold/70 hover:text-codix-gold"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-medium text-codix-gold mb-4">Team Members Details</h4>
                    <div className="space-y-4">
                      {selectedTeam.members.map((member, memberIndex) => {
                        const RoleIcon = roleIcons[member.role] || Users
                        return (
                          <div
                            key={memberIndex}
                            className={`p-6 rounded-lg border ${
                              member.role === 'Team Leader'
                                ? 'bg-codix-gold/10 border-codix-gold/30'
                                : 'bg-codix-blue/10 border-codix-blue/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`p-3 rounded-full ${
                                  member.role === 'Team Leader'
                                    ? 'bg-codix-gold/20'
                                    : 'bg-codix-blue/20'
                                }`}>
                                  <RoleIcon className={`h-6 w-6 ${
                                    member.role === 'Team Leader' ? 'text-codix-gold' : 'text-codix-gold/70'
                                  }`} />
                                </div>
                                <div>
                                  <h5 className="text-lg font-medium text-codix-light">{member.name}</h5>
                                  <p className="text-codix-gold/70">{member.role}</p>
                                </div>
                              </div>
                              {member.role === 'Team Leader' && (
                                <span className="px-3 py-1 bg-codix-gold/20 text-codix-gold rounded-full text-sm">
                                  Team Leader
                                </span>
                              )}
                            </div>
                            
                            {/* Contact details for team leader */}
                            {member.role === 'Team Leader' && (
                              <div className="mt-4 p-4 bg-codix-dark/30 rounded-lg">
                                <h6 className="text-sm font-medium text-codix-gold mb-2">Contact Information</h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-codix-gold/50" />
                                    <span className="text-codix-gold/70">{member.phone}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-codix-gold/50" />
                                    <span className="text-codix-gold/70">{member.email}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminStudentDetails
