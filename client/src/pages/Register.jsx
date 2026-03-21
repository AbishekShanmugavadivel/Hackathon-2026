import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Plus, X, Users, Code, Phone, Mail, Building, User, Crown, Shield, Palette, Presentation } from 'lucide-react'
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
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Users className="h-16 w-16 text-codix-gold mx-auto mb-4" />
          <h1 className="section-title">Team Registration</h1>
          <p className="text-lg text-codix-gold/70">
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
            <div className="card-gold p-8">
              <h2 className="text-2xl font-semibold text-codix-gold mb-6 flex items-center">
                <Users className="h-6 w-6 mr-2" />
                Team Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Team Name"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  error={errors.teamName}
                  placeholder="Enter your team name"
                  required
                />
                
                <FormInput
                  label="College Name"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  error={errors.collegeName}
                  placeholder="Enter your college/institute name"
                  required
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-codix-gold mb-2">
                  Select Domain <span className="text-red-500">*</span>
                </label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  className={`input-field ${errors.domain ? 'border-red-500 focus:border-red-500' : ''}`}
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
            <div className="card-gold p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-codix-gold flex items-center">
                  <Users className="h-6 w-6 mr-2" />
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
                  Add Member
                </button>
              </div>

              {errors.teamLeader && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-500 text-sm">{errors.teamLeader}</p>
                </div>
              )}

              <div className="text-sm text-codix-gold/70 mb-6">
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
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="card-gold p-6 mb-4 border border-codix-gold/30 hover:border-codix-gold/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            member.role === 'Team Leader' 
                              ? 'bg-codix-gold/20 gold-glow' 
                              : 'bg-codix-blue/20'
                          }`}>
                            <RoleIcon className={`h-5 w-5 ${
                              member.role === 'Team Leader' ? 'text-codix-gold' : 'text-codix-gold/70'
                            }`} />
                          </div>
                          <h3 className="text-lg font-medium text-codix-gold">
                            Member {index + 1}
                            {member.role === 'Team Leader' && (
                              <span className="ml-2 px-2 py-1 bg-codix-gold/20 text-codix-gold rounded-full text-xs">
                                Leader
                              </span>
                            )}
                          </h3>
                        </div>
                        {members.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMember(member.id)}
                            className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors duration-300"
                            title="Remove Member"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label="Student Name"
                          value={member.name}
                          onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                          error={errors[`member_${member.id}_name`]}
                          placeholder="Enter member name"
                          required
                        />
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-codix-gold">
                            Role <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={member.role}
                              onChange={(e) => handleMemberChange(member.id, 'role', e.target.value)}
                              className={`input-field appearance-none pr-10 ${
                                errors[`member_${member.id}_role`] ? 'border-red-500 focus:border-red-500' : ''
                              }`}
                              required
                            >
                              {roleOptions.map(role => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <RoleIcon className="h-4 w-4 text-codix-gold/50" />
                            </div>
                          </div>
                          {errors[`member_${member.id}_role`] && (
                            <p className="text-sm text-red-500">{errors[`member_${member.id}_role`]}</p>
                          )}
                        </div>
                      </div>

                      {/* Team Leader Contact Fields */}
                      {member.role === 'Team Leader' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-codix-gold/20"
                        >
                          <h4 className="text-sm font-medium text-codix-gold mb-3 flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            Team Leader Contact Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                              label="Mobile Number"
                              type="tel"
                              value={member.phone}
                              onChange={(e) => handleMemberChange(member.id, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                              error={errors[`member_${member.id}_phone`]}
                              placeholder="1234567890"
                              maxLength={10}
                              required
                            />
                            
                            <FormInput
                              label="Email ID"
                              type="email"
                              value={member.email}
                              onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                              error={errors[`member_${member.id}_email`]}
                              placeholder="leader@example.com"
                              required
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting || contextLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center px-8 py-3 text-lg"
              >
                {(isSubmitting || contextLoading) ? (
                  <>
                    <Loader size="small" text="" />
                    <span className="ml-2">Registering Team...</span>
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5 mr-2" />
                    Register Team
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
