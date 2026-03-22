import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, User, Building, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useAdminAuth } from '../hooks/useAdminAuth'

const ContactUs = () => {
  const { addMessage } = useAdminAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Prepare message object
    const messageData = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      timestamp: new Date().toLocaleString()
    }
    
    // Add message to admin context
    addMessage(messageData)
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon. 📧')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Mail className="h-16 w-16 text-codix-gold mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-4">Contact Us</h1>
          <p className="text-lg sm:text-xl text-codix-gold/70 max-w-2xl mx-auto">
            Have questions about CODIX Hackathon 2026? Get in touch with our team!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card-gold p-6 h-full">
              <h2 className="text-xl sm:text-2xl font-bold text-codix-gold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <User className="h-6 w-6 text-codix-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-codix-gold mb-1">Name</p>
                    <p className="text-codix-gold/70 font-bold">Abishek.s</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Building className="h-6 w-6 text-codix-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-codix-gold mb-1">College</p>
                    <p className="text-codix-gold/70 font-bold">Government Arts and Science College , Kuthalam</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-codix-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-codix-gold mb-1">Phone</p>
                    <p className="text-codix-gold/70 font-bold">+91 6789546378</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-codix-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-codix-gold mb-1">Email</p>
                    <p className="text-codix-gold/70 font-bold">abishek@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-codix-gold/10 rounded-lg border border-codix-gold/30">
                <p className="text-codix-gold font-bold text-center mb-2">Further Details</p>
                <p className="text-codix-gold/70 text-center font-bold">Contact Me</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="card-gold p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-codix-gold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-codix-gold font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-codix-gold font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-codix-gold font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-codix-gold font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="input-field w-full resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center py-3 sm:py-4 text-base sm:text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-codix-light mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-3" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card-gold p-6 sm:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-codix-gold mb-4">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-codix-gold mb-2">How do I register my team?</h3>
              <p className="text-codix-gold/70 mb-4">
                Visit the registration page and fill out the team details form. Make sure to provide accurate information for all team members.
              </p>
              
              <h3 className="text-lg font-semibold text-codix-gold mb-2">What are the eligibility criteria?</h3>
              <p className="text-codix-gold/70">
                Students from any college can participate. Each team must have 1-4 members with one designated team leader.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-codix-gold mb-2">When is the hackathon?</h3>
              <p className="text-codix-gold/70 mb-4">
                CODIX Hackathon 2026 will be held in March 2026. Exact dates will be announced soon.
              </p>
              
              <h3 className="text-lg font-semibold text-codix-gold mb-2">How can I contact support?</h3>
              <p className="text-codix-gold/70">
                Use the contact form above or reach out directly via phone or email for immediate assistance.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactUs
