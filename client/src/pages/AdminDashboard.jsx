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
  ArrowLeft,
  FileText
} from 'lucide-react'
import Loader from '../components/Loader'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { useTeamRegistration } from '../context/TeamRegistrationContext'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const AdminDashboard = () => {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()
  const { getPublicTeams, getFullTeams, loading: contextLoading, refreshTeams } = useTeamRegistration()
  const [students, setStudents] = useState([])
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
      } catch (error) {
        console.error('Error loading teams:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
  }, [getPublicTeams])

  const downloadTeamListPDF = () => {
    try {
      // Get full team data
      const fullTeams = getFullTeams()
      
      // Create PDF document with landscape orientation for better table fit
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      // Add custom font for better text rendering
      doc.setFontSize(16)
      doc.text('CODIX Hackathon 2026 - Team List', 14, 15)
      
      doc.setFontSize(10)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25)
      doc.text(`Total Teams: ${fullTeams.length}`, 14, 32)
      
      // Prepare table data with wrapped text for long names
      const tableData = fullTeams.map((team, index) => [
        index + 1,
        team.teamName.length > 25 ? team.teamName.substring(0, 22) + '...' : team.teamName,
        team.collegeName.length > 30 ? team.collegeName.substring(0, 27) + '...' : team.collegeName,
        team.domain,
        team.members.length.toString(),
        team.members.find(m => m.role === 'Team Leader')?.name || 'N/A',
        team.members.find(m => m.role === 'Team Leader')?.phone || 'N/A',
        team.members.find(m => m.role === 'Team Leader')?.email.length > 25 ? 
          team.members.find(m => m.role === 'Team Leader')?.email.substring(0, 22) + '...' : 
          team.members.find(m => m.role === 'Team Leader')?.email || 'N/A'
      ])
      
      // Add table to PDF with better column sizing
      doc.autoTable({
        head: [
          ['#', 'Team Name', 'College Name', 'Domain', 'Members', 'Team Leader', 'Phone', 'Email']
        ],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 2,
          font: 'helvetica',
          overflow: 'linebreak',
          cellWidth: 'auto'
        },
        headStyles: {
          fillColor: [255, 215, 0],
          textColor: [10, 25, 47],
          fontStyle: 'bold',
          fontSize: 10,
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' }, // #
          1: { cellWidth: 45, halign: 'left' }, // Team Name
          2: { cellWidth: 50, halign: 'left' }, // College Name
          3: { cellWidth: 35, halign: 'center' }, // Domain
          4: { cellWidth: 20, halign: 'center' }, // Members
          5: { cellWidth: 40, halign: 'left' }, // Team Leader
          6: { cellWidth: 30, halign: 'left' }, // Phone
          7: { cellWidth: 45, halign: 'left' }, // Email
        },
        margin: { top: 40, right: 10, bottom: 20, left: 10 },
        tableWidth: 'auto'
      })
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(
          `Page ${i} of ${pageCount} - CODIX Hackathon 2026`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        )
      }
      
      // Save the PDF
      doc.save(`CODIX_Hackathon_Teams_${new Date().toISOString().split('T')[0]}.pdf`)
      
      toast.success('Team list downloaded successfully! 📄')
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to download team list')
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.collegeName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDomain = selectedDomain === 'all' || student.domain === selectedDomain
    
    return matchesSearch && matchesDomain
  })

  const domainStats = domains.slice(1).map(domain => ({
    name: domain,
    count: students.filter(s => s.domain === domain).length
  }))

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/login')}
              className="btn-secondary flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Admin Dashboard</h1>
              <p className="text-codix-gold/70">Welcome back, Admin</p>
            </div>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={refreshTeams}
              disabled={loading || contextLoading}
              className="btn-secondary flex items-center"
              title="Refresh data from server"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Refresh
            </button>
            <button
              onClick={downloadTeamListPDF}
              className="btn-primary flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={() => navigate('/admin/student-details')}
              className="btn-secondary flex items-center"
            >
              <Users className="h-4 w-4 mr-2" />
              View Full Details
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
                <p className="text-codix-gold/70 text-sm">Total Registered</p>
                <p className="text-2xl font-bold text-codix-gold">{students.length}</p>
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
                <p className="text-codix-gold/70 text-sm">Today's Registrations</p>
                <p className="text-2xl font-bold text-codix-gold">
                  {students.filter(s => {
                    const today = new Date()
                    return new Date(s.registeredAt).toDateString() === today.toDateString()
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-codix-gold" />
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
              <TrendingUp className="h-8 w-8 text-codix-gold" />
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
                <p className="text-codix-gold/70 text-sm">Active Domains</p>
                <p className="text-2xl font-bold text-codix-gold">
                  {domainStats.filter(stat => stat.count > 0).length}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-codix-gold" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-gold p-6"
          >
            <h3 className="text-xl font-semibold text-codix-gold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/registered-students')}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <Users className="h-4 w-4 mr-2" />
                View Public Teams
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
              <button
                onClick={() => navigate('/admin/student-details')}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
              <button className="w-full btn-secondary flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-gold p-6"
          >
            <h3 className="text-xl font-semibold text-codix-gold mb-4">Domain Distribution</h3>
            <div className="space-y-2">
              {domainStats.map((stat, index) => (
                <div key={stat.name} className="flex items-center justify-between">
                  <span className="text-codix-gold/70">{stat.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-codix-blue/30 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-codix-gold to-codix-blue h-2 rounded-full"
                        style={{ width: `${students.length > 0 ? (stat.count / students.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-codix-gold font-medium w-8">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Registrations Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-gold overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-codix-gold mb-4">Recent Team Registrations</h3>
            
            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-codix-gold/20">
                    <th className="text-left py-3 px-4 text-codix-gold font-medium">Team Name</th>
                    <th className="text-left py-3 px-4 text-codix-gold font-medium">College Name</th>
                    <th className="text-left py-3 px-4 text-codix-gold font-medium">Domain</th>
                    <th className="text-left py-3 px-4 text-codix-gold font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.slice(0, 5).map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-codix-gold/10 hover:bg-codix-blue/10"
                    >
                      <td className="py-3 px-4 text-codix-light font-medium">{student.teamName}</td>
                      <td className="py-3 px-4 text-codix-gold/70">{student.collegeName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-codix-gold/20 text-codix-gold rounded-full text-sm">
                          {student.domain}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate('/admin/student-details')}
                            className="p-2 text-codix-gold hover:bg-codix-gold/20 rounded transition-colors duration-300"
                            title="View Full Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length > 5 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/admin/student-details')}
                  className="btn-secondary flex items-center mx-auto"
                >
                  View All Teams ({filteredStudents.length})
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
