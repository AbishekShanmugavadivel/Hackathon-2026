import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Lock, Eye, EyeOff, ArrowLeft, User } from 'lucide-react'
import FormInput from '../components/FormInput'
import Loader from '../components/Loader'
import { useAdminAuth } from '../hooks/useAdminAuth'

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAdminAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    adminId: '',
    password: ''
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.adminId.trim()) {
      newErrors.adminId = 'Admin ID is required'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const success = await login(formData)
    if (success) {
      navigate('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-codix-blue/90 via-codix-dark to-codix-blue/90" />

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-codix-gold/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-codix-gold/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >

        {/* Back */}
        <Link 
          to="/" 
          className="inline-flex items-center text-codix-gold hover:text-codix-light mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Card */}
        <div className="card-gold p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-codix-gold/20 rounded-full">
                <Shield className="h-8 w-8 text-codix-gold" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gradient mb-2">
              Admin Portal
            </h1>

            <p className="text-codix-gold/70">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">

            <FormInput
              label="Admin ID"
              name="adminId"
              value={formData.adminId}
              onChange={handleInputChange}
              error={errors.adminId}
              placeholder="Enter Admin ID"
              icon={User}
            />

            <div className="space-y-2">
              <label className="block text-sm text-codix-gold">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pr-12"
                  placeholder="Enter password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex justify-center"
            >
              {isLoading ? (
                <>
                  <Loader size="small" />
                  <span className="ml-2">Signing in...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-codix-gold/50 text-sm">
              Protected with enterprise-grade security
            </p>
          </div>

        </div> {/* ✅ FIX: closed card-gold div */}

      </motion.div>

    </div>
  )
}

export default AdminLogin