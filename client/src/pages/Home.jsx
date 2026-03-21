import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Code, 
  Users, 
  Clock, 
  Target, 
  Star,
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Trophy,
      title: 'Win Amazing Prizes',
      description: 'Compete for cash prizes and recognition',
    },
    {
      icon: Code,
      title: 'Build Cool Projects',
      description: 'Create innovative solutions with cutting-edge tech',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work with talented developers and designers',
    },
    {
      icon: Clock,
      title: '24-Hour Challenge',
      description: 'Intense coding marathon to test your limits',
    },
  ]

  const stats = [
    { label: 'Total Prize Pool', value: '₹50,000+' },
    { label: 'Teams Expected', value: '50+' },
    { label: 'Duration', value: '24 Hours' },
    { label: 'Mentors', value: '10+' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-codix-blue/90 via-codix-dark to-codix-blue/90" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-codix-gold/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-codix-gold/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title mb-6">
              CODIX HACKATHON 2024
            </h1>
            <p className="text-xl md:text-2xl text-codix-gold/90 mb-8 max-w-3xl mx-auto">
              Where Innovation Meets Technology. Join us for an epic 24-hour coding marathon!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/register" className="btn-primary">
                Register Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/rules" className="btn-secondary">
                View Rules
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-codix-gold">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>March 25-26, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Tech Campus, Bangalore</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 glass-morphism">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-codix-gold/70">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Why Join CODIX Hackathon?</h2>
            <p className="text-lg text-codix-gold/70 max-w-2xl mx-auto">
              Experience the ultimate coding challenge with amazing opportunities for growth and recognition.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-gold text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-codix-gold/20 rounded-full group-hover:bg-codix-gold/30 transition-colors duration-300">
                      <Icon className="h-8 w-8 text-codix-gold" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-codix-gold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-codix-gold/70">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="card-gold p-12"
          >
            <Star className="h-16 w-16 text-codix-gold mx-auto mb-6 animate-pulse-slow" />
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Ready to Challenge Yourself?
            </h2>
            <p className="text-lg text-codix-gold/70 mb-8">
              Don't miss this opportunity to showcase your skills and win amazing prizes!
            </p>
            <Link to="/register" className="btn-primary inline-flex items-center">
              Register Your Team Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
