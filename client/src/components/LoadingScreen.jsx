import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const LoadingScreen = () => {
  const navigate = useNavigate()
  const [currentText, setCurrentText] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  const loadingTexts = [
    "Initializing Hackathon System...",
    "Loading Modules...",
    "Welcome to CODIX Hackathon 2026"
  ]

  useEffect(() => {
    const currentFullText = loadingTexts[currentText]
    let charIndex = 0

    const typeInterval = setInterval(() => {
      if (charIndex <= currentFullText.length) {
        setDisplayedText(currentFullText.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeInterval)
        
        // Move to next text after a pause
        setTimeout(() => {
          if (currentText < loadingTexts.length - 1) {
            setCurrentText(prev => prev + 1)
            setDisplayedText('')
          } else {
            // Last text, wait and then redirect
            setIsTyping(false)
            setTimeout(() => {
              navigate('/home')
            }, 1500)
          }
        }, 1000)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [currentText, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-codix-blue via-codix-dark to-codix-blue flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-codix-gold/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-codix-gold/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-codix-gold/5 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-codix-gold to-codix-blue rounded-xl flex items-center justify-center gold-glow">
              <span className="text-2xl font-bold text-codix-dark">C</span>
            </div>
            <h1 className="text-5xl font-bold text-gradient">CODIX</h1>
          </div>
          <div className="text-codix-gold/70 text-lg">Hackathon Registration System</div>
        </motion.div>

        {/* Typing Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="glass-morphism rounded-2xl p-8 max-w-2xl mx-auto"
        >
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-codix-gold rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-codix-gold/60 rounded-full animate-pulse delay-100" />
              <div className="w-3 h-3 bg-codix-gold/30 rounded-full animate-pulse delay-200" />
            </div>
            <div className="text-left">
              <p className="text-codix-gold text-lg font-mono">
                {displayedText}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="mt-12 h-1 bg-codix-gold/20 rounded-full overflow-hidden max-w-md mx-auto"
        >
          <div className="h-full bg-gradient-to-r from-codix-gold to-codix-blue rounded-full" />
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8 flex space-x-2 justify-center"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 bg-codix-gold rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingScreen
