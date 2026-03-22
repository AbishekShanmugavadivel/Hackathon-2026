import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Plus, X, Users, Code, Phone, Mail, Building, User, Crown, Shield, Palette, Presentation, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import Loader from '../components/Loader'
import { useTeamRegistration } from '../context/TeamRegistrationContext'

const Register = () => {
  const navigate = useNavigate()
  const { addTeam, loading: contextLoading } = useTeamRegistration()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    teamName: '',
    collegeName: '',
    domain: ''
  })
  const [errors, setErrors] = useState({})
  
  // Team members state
  const [members, setMembers] = useState([
    {
      id: 1,
      name: '',
      role: 'Team Leader',
      phone: '',
      email: ''
    }
  ])

  const roleOptions = [
    { value: 'Team Leader', icon: Crown, label: 'Team Leader' },
    { value: 'Developer', icon: Code, label: 'Developer' },
    { value: 'Designer', icon: Palette, label: 'Designer' },
    { value: 'Presenter', icon: Presentation, label: 'Presenter' }
  ]

  const domainOptions = [
    'Web Development',
    'AI/ML',
    'Cyber Security',
    'IoT',
    'Mobile App',
    'Open Innovation'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleMemberChange = (memberId, field, value) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, [field]: value } : member
    ))
    
    // Clear error and validate in real-time for email and phone
    const errorKey = `member_${memberId}_${field}`
    const member = members.find(m => m.id === memberId)
    
    if (field === 'email' && member.role === 'Team Leader') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, [errorKey]: 'Email is required' }))
      } else if (!emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, [errorKey]: 'Invalid email format' }))
      } else {
        setErrors(prev => ({ ...prev, [errorKey]: '' }))
      }
    } else if (field === 'phone' && member.role === 'Team Leader') {
      const phoneRegex = /^[6-9]\d{9}$/
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, [errorKey]: 'Phone number is required' }))
      } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        setErrors(prev => ({ ...prev, [errorKey]: 'Phone must be 10 digits starting with 6-9' }))
      } else {
        setErrors(prev => ({ ...prev, [errorKey]: '' }))
      }
    } else {
      // Clear error for other fields
      if (errors[errorKey]) {
        setErrors(prev => ({ ...prev, [errorKey]: '' }))
      }
    }
  }

  const addMember = () => {
    if (members.length >= 4) {
      toast.error('Maximum 4 members allowed per team')
      return
    }

    const newMember = {
      id: Date.now(),
      name: '',
      role: 'Developer',
      phone: '',
      email: ''
    }

    setMembers(prev => [...prev, newMember])
  }

  const removeMember = (memberId) => {
    if (members.length <= 1) {
      toast.error('At least one member is required')
      return
    }

    setMembers(prev => prev.filter(member => member.id !== memberId))
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Team name validation
    if (!formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required'
    }
    
    // College name validation
    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required'
    }
    
    // Domain validation
    if (!formData.domain) {
      newErrors.domain = 'Domain is required'
    }
    
    // Members validation
    members.forEach((member, index) => {
      // Name validation
      if (!member.name.trim()) {
        newErrors[`member_${member.id}_name`] = 'Member name is required'
      }
      
      // Role validation
      if (!member.role) {
        newErrors[`member_${member.id}_role`] = 'Role is required'
      }
      
      // Team Leader specific validation
      if (member.role === 'Team Leader') {
        // Phone validation (10 digits, must start with 6-9)
        const phoneRegex = /^[6-9]\d{9}$/
        if (!member.phone.trim()) {
          newErrors[`member_${member.id}_phone`] = 'Phone number is required'
        } else if (!phoneRegex.test(member.phone.replace(/\s/g, ''))) {
          newErrors[`member_${member.id}_phone`] = 'Phone must be 10 digits starting with 6-9'
        }
        
        // Email validation (proper regex format)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!member.email.trim()) {
          newErrors[`member_${member.id}_email`] = 'Email is required'
        } else if (!emailRegex.test(member.email)) {
          newErrors[`member_${member.id}_email`] = 'Invalid email format'
        }
      }
    })
    
    // Check if exactly one team leader exists
    const teamLeaders = members.filter(member => member.role === 'Team Leader')
    if (teamLeaders.length !== 1) {
      newErrors.teamLeader = 'Exactly one Team Leader is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setIsSubmitting(true)

      // Prepare submission data
      const submissionData = {
        teamName: formData.teamName,
        collegeName: formData.collegeName,
        domain: formData.domain,
        members: members.map(member => ({
          name: member.name,
          role: member.role,
          phone: member.role === 'Team Leader' ? member.phone : '',
          email: member.role === 'Team Leader' ? member.email : ''
        }))
      }

      // Add team using context
      await addTeam(submissionData)
      
      // Reset form
      setFormData({
        teamName: '',
        collegeName: '',
        domain: ''
      })
      setMembers([
        {
          id: 1,
          name: '',
          role: 'Team Leader',
          phone: '',
          email: ''
        }
      ])
      setErrors({})
      
      // Redirect to Registered Students page
      navigate('/registered-students')
      
    } catch (error) {
      // Error is handled by the context
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleIcon = (role) => {
    const roleOption = roleOptions.find(r => r.value === role)
    return roleOption ? roleOption.icon : User
  }

  return (
    <div className="min-h-screen py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Users className="h-12 w-12 sm:h-16 sm:w-16 text-codix-gold mx-auto mb-4" />
          <h1 className="section-title text-xl sm:text-2xl lg:text-3xl">Team Registration</h1>
          <p className="text-base sm:text-lg text-codix-gold/70">
            Register your team for CODIX Hackathon 2026!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Team Information Section */}
            <div className="card-gold p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-codix-gold font-medium mb-2 text-sm sm:text-base">Team Name</label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full text-sm sm:text-base"
                    placeholder="Enter your team name"
                  />
                  {errors.teamName && (
                    <p className="text-sm text-red-500 mt-1">{errors.teamName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-codix-gold font-medium mb-2 text-sm sm:text-base">College Name</label>
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full text-sm sm:text-base"
                    placeholder="Enter your college name"
                  />
                  {errors.collegeName && (
                    <p className="text-sm text-red-500 mt-1">{errors.collegeName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-codix-gold font-medium mb-2 text-sm sm:text-base">Domain</label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  className={`input-field w-full text-sm sm:text-base ${errors.domain ? 'border-red-500 focus:border-red-500' : ''}`}
                  required
                >
                  <option value="">Select a domain</option>
                  {domainOptions.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
                {errors.domain && (
                  <p className="text-sm text-red-500 mt-1">{errors.domain}</p>
                )}
              </div>
            </div>

            {/* Team Members Section */}
            <div className="card-gold p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-codix-gold flex items-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  Team Members ({members.length}/4)
                </h2>
                <button
                  type="button"
                  onClick={addMember}
                  disabled={members.length >= 4}
                  className={`btn-secondary flex items-center transition-all duration-300 ${
                    members.length >= 4 
                      ? 'opacity-50 cursor-not-allowed bg-gray-600' 
                      : 'hover:scale-105'
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Member</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>

              {errors.teamLeader && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-500 text-sm">{errors.teamLeader}</p>
                </div>
              )}

              <div className="text-sm text-codix-gold/70 mb-4 sm:mb-6">
                Each team can have 1-4 members. Exactly one member must be designated as Team Leader.
              </div>

              <AnimatePresence>
                {members.map((member, index) => {
                  const RoleIcon = getRoleIcon(member.role)
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 50, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-codix-dark/30 border border-codix-gold/20 rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <select
                            value={member.role}
                            onChange={(e) => handleMemberChange(member.id, 'role', e.target.value)}
                            className="input-field text-sm sm:text-base"
                          >
                            {roleOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMember(member.id)}
                          disabled={members.length <= 1}
                          className={`p-2 text-red-500 hover:bg-red-600 rounded-lg transition-colors duration-300 ${
                            members.length <= 1 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:scale-105'
                          }`}
                          title="Remove member"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-codix-gold font-medium mb-2 text-sm sm:text-base">Name</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                            required
                            className="input-field w-full text-sm sm:text-base"
                            placeholder="Enter member name"
                          />
                          {errors[`member_${member.id}_name`] && (
                            <p className="text-sm text-red-500 mt-1">{errors[`member_${member.id}_name`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-codix-gold font-medium mb-2 text-sm sm:text-base">Phone</label>
                          <input
                            type="tel"
                            value={member.phone}
                            onChange={(e) => {
                              // Allow only digits and limit to 10 characters
                              const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                              handleMemberChange(member.id, 'phone', value)
                            }}
                            onKeyPress={(e) => {
                              // Allow only numbers, backspace, delete, tab, enter
                              if (!/[0-9\b\t\n\r]/.test(e.key)) {
                                e.preventDefault()
                              }
                            }}
                            required={member.role === 'Team Leader'}
                            className="input-field w-full text-sm sm:text-base"
                            placeholder="Enter 10 digit phone number"
                            maxLength={10}
                            pattern="[0-9]{10}"
                            inputMode="numeric"
                          />
                          {errors[`member_${member.id}_phone`] && (
                            <p className="text-sm text-red-500 mt-1">{errors[`member_${member.id}_phone`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-codix-gold font-medium mb-2 text-sm sm:text-base">Email</label>
                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                            required={member.role === 'Team Leader'}
                            className="input-field w-full text-sm sm:text-base"
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 sm:mt-8">
              <button
                type="button"
                onClick={() => navigate('/registered-students')}
                className="btn-secondary flex items-center text-sm sm:text-base"
              >
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">View Registered Teams</span>
                <span className="sm:hidden">Teams</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting || contextLoading}
                className="btn-primary flex items-center text-sm sm:text-base py-2 sm:py-3 px-6 sm:px-8"
              >
                {isSubmitting || contextLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-codix-light mr-3"></div>
                    <span className="hidden sm:inline">Registering Team...</span>
                    <span className="sm:hidden">Registering...</span>
                  </>
                ) : (
                  <>
                    <Trophy className="h-5 w-5 mr-3" />
                    <span className="hidden sm:inline">Register Team</span>
                    <span className="sm:hidden">Register</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
