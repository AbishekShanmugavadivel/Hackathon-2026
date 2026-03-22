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
  FileText,
  Mail,
  X
} from 'lucide-react'
import Loader from '../components/Loader'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { useTeamRegistration } from '../context/TeamRegistrationContext'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const AdminDashboard = () => {
  const { logout, messages, clearMessages } = useAdminAuth()
  const navigate = useNavigate()
  const { getPublicTeams, getFullTeams, loading: contextLoading, refreshTeams } = useTeamRegistration()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [showMessages, setShowMessages] = useState(false)

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
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('CODIX Hackathon 2026', 148, 20, { align: 'center' })
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Total Teams: ${fullTeams.length}`, 148, 35, { align: 'center' })
      
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
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        )
      }
      
      // Save the PDF
      doc.save('CODIX_Hackathon_2026.pdf')
      
      toast.success('Team list downloaded successfully! 📄')
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to download team list')
    }
  }

  const downloadCSV = () => {
    try {
      // Get full team data
      const fullTeams = getFullTeams()
      
      // Prepare CSV data
      const csvData = fullTeams.map((team, index) => ({
        'S.No': index + 1,
        'Team Name': team.teamName,
        'College Name': team.collegeName,
        'Domain': team.domain,
        'Total Members': team.members.length,
        'Team Leader': team.members.find(m => m.role === 'Team Leader')?.name || 'N/A',
        'Phone': team.members.find(m => m.role === 'Team Leader')?.phone || 'N/A',
        'Email': team.members.find(m => m.role === 'Team Leader')?.email || 'N/A'
      }))
      
      // Convert to CSV format
      const headers = Object.keys(csvData[0])
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n')
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'CODIX_Hackathon_2026.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('CSV file downloaded successfully! 📊')
      
    } catch (error) {
      console.error('Error generating CSV:', error)
      toast.error('Failed to download CSV')
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
    <div className="min-h-screen py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4 mb-4 md:mb-0">
            <button
              onClick={() => navigate('/admin/login')}
              className="btn-secondary flex items-center text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
              <span className="sm:hidden">←</span>
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient mb-1 sm:mb-2">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-codix-gold/70">Welcome back, Admin</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowMessages(!showMessages)}
              className="relative btn-secondary flex items-center text-sm sm:text-base"
              title="View Messages"
            >
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Messages</span>
              <span className="sm:hidden">📧</span>
              {messages && messages.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {messages.length}
                </span>
              )}
            </button>
            <button
              onClick={refreshTeams}
              disabled={loading || contextLoading}
              className="btn-secondary flex items-center text-sm sm:text-base"
              title="Refresh data from server"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">↻</span>
            </button>
            <button
              onClick={downloadTeamListPDF}
              className="btn-primary flex items-center text-sm sm:text-base"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={() => navigate('/admin/student-details')}
              className="btn-secondary flex items-center text-sm sm:text-base"
            >
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View Full Details</span>
              <span className="sm:hidden">Details</span>
            </button>
            <button
              onClick={logout}
              className="btn-secondary flex items-center text-sm sm:text-base"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">→</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-gold"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-codix-gold/70 text-xs sm:text-sm">Total Registered</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-codix-gold truncate">{students.length}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-codix-gold flex-shrink-0 ml-2" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card-gold"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-codix-gold/70 text-xs sm:text-sm">Today's Registrations</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-codix-gold truncate">
                  {students.filter(s => {
                    const today = new Date()
                    return new Date(s.registeredAt).toDateString() === today.toDateString()
                  }).length}
                </p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-codix-gold flex-shrink-0 ml-2" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-gold"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-codix-gold/70 text-xs sm:text-sm">Top Domain</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-codix-gold truncate">
                  {domainStats.reduce((max, stat) => stat.count > max.count ? stat : max, { count: 0 }).name || 'N/A'}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-codix-gold flex-shrink-0 ml-2" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card-gold"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-codix-gold/70 text-xs sm:text-sm">Active Domains</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-codix-gold truncate">
                  {domainStats.filter(stat => stat.count > 0).length}
                </p>
              </div>
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-codix-gold flex-shrink-0 ml-2" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-gold p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-codix-gold mb-3 sm:mb-4">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => navigate('/registered-students')}
                className="w-full btn-secondary flex items-center justify-center text-sm sm:text-base py-2 sm:py-3"
              >
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">View Public Teams</span>
                <span className="sm:hidden">Teams</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
              <button
                onClick={() => navigate('/admin/student-details')}
                className="w-full btn-primary flex items-center justify-center text-sm sm:text-base py-2 sm:py-3"
              >
                <Eye className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">View Full Details</span>
                <span className="sm:hidden">Details</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
              <button onClick={downloadCSV} className="w-full btn-secondary flex items-center justify-center text-sm sm:text-base py-2 sm:py-3">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export to CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-gold p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-codix-gold mb-3 sm:mb-4">Domain Distribution</h3>
            <div className="space-y-2">
              {domainStats.map((stat, index) => (
                <div key={stat.name} className="flex items-center justify-between">
                  <span className="text-codix-gold/70 text-xs sm:text-sm truncate flex-1 mr-2">{stat.name}</span>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className="w-12 sm:w-16 md:w-20 bg-codix-blue/30 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-codix-gold to-codix-blue h-2 rounded-full"
                        style={{ width: `${students.length > 0 ? (stat.count / students.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-codix-gold font-medium w-6 sm:w-8 text-xs sm:text-sm">{stat.count}</span>
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
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-codix-gold mb-3 sm:mb-4">Recent Team Registrations</h3>
            
            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-codix-gold/50" />
                  <input
                    type="text"
                    placeholder="Search by team name or college..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-9 sm:pl-10 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-codix-gold" />
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="input-field text-sm sm:text-base"
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
            <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
              <table className="w-full min-w-[400px] sm:min-w-full">
                <thead>
                  <tr className="border-b border-codix-gold/20">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-codix-gold font-medium text-xs sm:text-sm">Team Name</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-codix-gold font-medium text-xs sm:text-sm hidden sm:table-cell">College Name</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-codix-gold font-medium text-xs sm:text-sm">Domain</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-codix-gold font-medium text-xs sm:text-sm">Actions</th>
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
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-codix-light font-medium text-xs sm:text-sm">
                        <div className="max-w-[120px] sm:max-w-full truncate">{student.teamName}</div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-codix-gold/70 text-xs sm:text-sm hidden sm:table-cell">
                        <div className="max-w-[150px] sm:max-w-full truncate">{student.collegeName}</div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <span className="px-2 py-1 bg-codix-gold/20 text-codix-gold rounded-full text-xs">
                          {student.domain}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate('/admin/student-details')}
                            className="p-1.5 sm:p-2 text-codix-gold hover:bg-codix-gold/20 rounded transition-colors duration-300"
                            title="View Full Details"
                          >
                            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length > 5 && (
              <div className="mt-3 sm:mt-4 text-center">
                <button
                  onClick={() => navigate('/admin/student-details')}
                  className="btn-secondary flex items-center mx-auto text-sm sm:text-base py-2 sm:py-3"
                >
                  <span className="hidden sm:inline">View All Teams ({filteredStudents.length})</span>
                  <span className="sm:hidden">All ({filteredStudents.length})</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Messages Popup */}
      {showMessages && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowMessages(false)}
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="card-gold max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-codix-gold/20">
              <h2 className="text-xl sm:text-2xl font-bold text-codix-gold">Student Messages</h2>
              <button
                onClick={() => setShowMessages(false)}
                className="p-2 text-codix-gold hover:bg-codix-gold/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
              {messages && messages.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-codix-gold/50 mx-auto mb-4" />
                  <p className="text-codix-gold/70">No messages received yet.</p>
                </div>
              ) : messages && (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-codix-blue/10 rounded-lg border border-codix-gold/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-codix-gold font-semibold text-sm sm:text-base mb-1">
                            {message.subject}
                          </h3>
                          <p className="text-codix-gold/70 text-xs sm:text-sm mb-2">
                            From: {message.name} ({message.email})
                          </p>
                        </div>
                        <span className="text-codix-gold/50 text-xs whitespace-nowrap">
                          {message.timestamp}
                        </span>
                      </div>
                      <div className="bg-codix-dark/30 p-3 rounded border-l-4 border-codix-gold">
                        <p className="text-codix-light text-sm leading-relaxed">
                          {message.message}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 sm:p-6 border-t border-codix-gold/20">
              <button
                onClick={() => clearMessages()}
                className="btn-secondary w-full flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Messages
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminDashboard
