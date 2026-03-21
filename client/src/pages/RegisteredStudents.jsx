import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, Building, Code, Filter } from 'lucide-react'
import Loader from '../components/Loader'
import { useTeamRegistration } from '../context/TeamRegistrationContext'

const RegisteredStudents = () => {
  const { getPublicTeams, loading: contextLoading, refreshTeams } = useTeamRegistration()
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('all')

  const domains = ['all', 'Web Development', 'AI/ML', 'Cyber Security', 'IoT', 'Mobile App', 'Open Innovation']

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true)
        const publicTeams = getPublicTeams()
        setStudents(publicTeams)
        setFilteredStudents(publicTeams)
      } catch (error) {
        console.error('Error loading teams:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
  }, [getPublicTeams])

  useEffect(() => {
    let filtered = students

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.collegeName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by domain
    if (selectedDomain !== 'all') {
      filtered = filtered.filter(student => student.domain === selectedDomain)
    }

    setFilteredStudents(filtered)
  }, [searchTerm, selectedDomain, students])

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading registered teams..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Users className="h-16 w-16 text-codix-gold mx-auto mb-4" />
          <h1 className="section-title">Registered Teams</h1>
          <p className="text-lg text-codix-gold/70">
            View all registered hackathon teams
          </p>
          <button
            onClick={refreshTeams}
            disabled={loading || contextLoading}
            className="mt-4 btn-secondary flex items-center mx-auto"
            title="Refresh data from server"
          >
            <Filter className="h-4 w-4 mr-2" />
            Refresh Teams
          </button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-gold p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-codix-gold/50" />
                <input
                  type="text"
                  placeholder="Search by team name or college..."
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
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-codix-gold/70">
          Showing {filteredStudents.length} of {students.length} teams
        </div>

        {/* Teams Grid */}
        {filteredStudents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="h-16 w-16 text-codix-gold/50 mx-auto mb-4" />
            <p className="text-codix-gold/70">No teams registered yet</p>
            <p className="text-codix-gold/50 text-sm mt-2">Teams will appear here once they register</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-gold p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-codix-gold/20 rounded-full">
                    <Users className="h-6 w-6 text-codix-gold" />
                  </div>
                  <span className="px-3 py-1 bg-codix-blue/20 text-codix-gold rounded-full text-sm">
                    {team.domain}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-codix-gold">{team.teamName}</h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-codix-gold/50" />
                      <span className="text-codix-gold/70">{team.collegeName}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Table View for Desktop */}
        <div className="hidden lg:block mt-8">
          <div className="card-gold overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-codix-gold/20">
                    <th className="text-left py-3 px-4 text-codix-gold font-medium">Team Name</th>
                    <th className="text-left py-3 px-4 text-codix-gold font-medium">College Name</th>
                    <th className="text-left py-3 px-4 text-codix-gold font-medium">Domain</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((team, index) => (
                    <motion.tr
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-codix-gold/10 hover:bg-codix-blue/10"
                    >
                      <td className="py-3 px-4 text-codix-light font-medium">{team.teamName}</td>
                      <td className="py-3 px-4 text-codix-gold/70">{team.collegeName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-codix-gold/20 text-codix-gold rounded-full text-sm">
                          {team.domain}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisteredStudents
