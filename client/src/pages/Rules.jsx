import { motion } from 'framer-motion'
import { 
  FileText, 
  Users, 
  Clock, 
  AlertTriangle, 
  Shield, 
  Award,
  CheckCircle,
  XCircle
} from 'lucide-react'

const Rules = () => {
  const rules = [
    {
      icon: Users,
      title: 'Team Composition',
      description: 'Each team must consist of 2-4 members including the team leader.',
      type: 'important'
    },
    {
      icon: Clock,
      title: 'Duration',
      description: 'The hackathon will run for 24 hours continuously.',
      type: 'normal'
    },
    {
      icon: Shield,
      title: 'Original Work',
      description: 'All projects must be original work. Plagiarism is strictly prohibited.',
      type: 'critical'
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Teams must maintain proper documentation and README files.',
      type: 'normal'
    },
    {
      icon: Award,
      title: 'Judging',
      description: 'Projects will be evaluated based on innovation, technical complexity, and presentation.',
      type: 'important'
    },
    {
      icon: AlertTriangle,
      title: 'Code of Conduct',
      description: 'Professional behavior is expected. Any misconduct will lead to disqualification.',
      type: 'critical'
    }
  ]

  const guidelines = [
    'Use of external libraries and APIs is allowed but must be properly credited.',
    'Teams can work on any of the four domains: AI, Web, App, or Cybersecurity.',
    'All team members must be present during the final presentation.',
    'Projects must be deployed and accessible for demo during judging.',
    'Mentors will be available for guidance during the hackathon.',
    'Food and beverages will be provided throughout the event.'
  ]

  const restrictions = [
    'No pre-built projects or templates.',
    'No use of copyrighted material without permission.',
    'No external help during the final 6 hours.',
    'No modification of project after submission deadline.',
    'No disruptive behavior that affects other teams.'
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <FileText className="h-16 w-16 text-codix-gold mx-auto mb-4" />
          <h1 className="section-title">Rules & Guidelines</h1>
          <p className="text-lg text-codix-gold/70 max-w-3xl mx-auto">
            Please read and understand all the rules before participating in the CODIX Hackathon 2024.
          </p>
        </motion.div>

        {/* Main Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {rules.map((rule, index) => {
            const Icon = rule.icon
            const borderColor = rule.type === 'critical' ? 'border-red-500' : 
                               rule.type === 'important' ? 'border-yellow-500' : 
                               'border-codix-gold'
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`card-gold border-l-4 ${borderColor}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${
                    rule.type === 'critical' ? 'bg-red-500/20 text-red-500' :
                    rule.type === 'important' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-codix-gold/20 text-codix-gold'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-codix-gold mb-2">
                      {rule.title}
                    </h3>
                    <p className="text-codix-gold/70">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Guidelines Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="card-gold p-8">
            <h2 className="text-2xl font-semibold text-codix-gold mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
              Important Guidelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guidelines.map((guideline, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-codix-gold/70">{guideline}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Restrictions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="card-gold p-8 border-l-4 border-red-500">
            <h2 className="text-2xl font-semibold text-codix-gold mb-6 flex items-center">
              <XCircle className="h-6 w-6 mr-2 text-red-500" />
              Strict Prohibitions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restrictions.map((restriction, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-codix-gold/70">{restriction}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="card-gold p-8"
        >
          <h2 className="text-2xl font-semibold text-codix-gold mb-6">Event Timeline</h2>
          <div className="space-y-4">
            {[
              { time: '9:00 AM', event: 'Registration & Team Check-in' },
              { time: '10:00 AM', event: 'Hackathon Kick-off & Theme Announcement' },
              { time: '11:00 AM', event: 'Coding Begins!' },
              { time: '1:00 PM', event: 'Lunch Break' },
              { time: '6:00 PM', event: 'Dinner & Mentor Sessions' },
              { time: '10:00 AM (Next Day)', event: 'Coding Ends' },
              { time: '11:00 AM', event: 'Project Presentations Begin' },
              { time: '2:00 PM', event: 'Judging & Results' },
              { time: '3:00 PM', event: 'Prize Distribution & Closing Ceremony' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-20 text-right">
                    <span className="text-codix-gold font-medium">{item.time}</span>
                  </div>
                </div>
                <div className="w-4 h-4 bg-codix-gold rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-codix-gold/70">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final Note */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="card-gold p-8 bg-gradient-to-br from-codix-blue/50 to-codix-dark/50">
            <Shield className="h-12 w-12 text-codix-gold mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-codix-gold mb-3">
              Code of Conduct
            </h3>
            <p className="text-codix-gold/70 max-w-2xl mx-auto">
              All participants are expected to maintain professional behavior throughout the event. 
              Any form of harassment, discrimination, or misconduct will result in immediate disqualification 
              without any refund. The organizers' decisions will be final and binding.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Rules
