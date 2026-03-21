import { motion } from 'framer-motion'
import { 
  Scale, 
  Lightbulb, 
  Code, 
  Palette, 
  Zap, 
  Presentation,
  TrendingUp,
  Award
} from 'lucide-react'

const Criteria = () => {
  const criteria = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      score: 25,
      description: 'Originality and creativity of the idea',
      details: [
        'Novel approach to problem-solving',
        'Unique features and functionality',
        'Creative use of technology',
        'Market potential and impact'
      ]
    },
    {
      icon: Code,
      title: 'Technical Complexity',
      score: 20,
      description: 'Technical implementation and architecture',
      details: [
        'Code quality and structure',
        'Use of appropriate technologies',
        'Integration of multiple components',
        'Handling of edge cases'
      ]
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      score: 15,
      description: 'User interface and user experience',
      details: [
        'Visual appeal and aesthetics',
        'Intuitive navigation',
        'Responsive design',
        'Accessibility considerations'
      ]
    },
    {
      icon: Zap,
      title: 'Functionality',
      score: 20,
      description: 'Working features and performance',
      details: [
        'Core features implementation',
        'Performance optimization',
        'Error handling',
        'Real-world applicability'
      ]
    },
    {
      icon: Presentation,
      title: 'Presentation',
      score: 10,
      description: 'Quality of final presentation',
      details: [
        'Clear communication',
        'Demonstration effectiveness',
        'Visual presentation quality',
        'Q&A handling'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Feasibility',
      score: 10,
      description: 'Practical implementation potential',
      details: [
        'Scalability considerations',
        'Resource requirements',
        'Business viability',
        'Future development roadmap'
      ]
    }
  ]

  const totalScore = criteria.reduce((sum, item) => sum + item.score, 0)

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
          <Scale className="h-16 w-16 text-codix-gold mx-auto mb-4" />
          <h1 className="section-title">Judging Criteria</h1>
          <p className="text-lg text-codix-gold/70 max-w-3xl mx-auto">
            Projects will be evaluated based on the following criteria. Total score: {totalScore} points
          </p>
        </motion.div>

        {/* Total Score Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="card-gold p-8 bg-gradient-to-br from-codix-gold/20 to-codix-blue/20">
            <Award className="h-16 w-16 text-codix-gold mx-auto mb-4 animate-pulse-slow" />
            <div className="text-5xl font-bold text-gradient mb-2">{totalScore}</div>
            <div className="text-xl text-codix-gold">Total Points</div>
          </div>
        </motion.div>

        {/* Criteria Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {criteria.map((item, index) => {
            const Icon = item.icon
            const percentage = (item.score / totalScore) * 100
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-gold"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-codix-gold/20 rounded-full">
                      <Icon className="h-6 w-6 text-codix-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-codix-gold">
                        {item.title}
                      </h3>
                      <p className="text-sm text-codix-gold/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-codix-gold">
                    {item.score}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-codix-gold/70 mb-1">
                    <span>Score Weight</span>
                    <span>{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-codix-blue/30 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className="bg-gradient-to-r from-codix-gold to-codix-blue h-3 rounded-full"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  {item.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-codix-gold rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-codix-gold/70">{detail}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Judging Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="card-gold p-8 mb-16"
        >
          <h2 className="text-2xl font-semibold text-codix-gold mb-6">Judging Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Initial Screening',
                description: 'Teams present their projects to a panel of judges'
              },
              {
                step: '2',
                title: 'Technical Evaluation',
                description: 'In-depth review of code quality and architecture'
              },
              {
                step: '3',
                title: 'Final Decision',
                description: 'Judges deliberate and select winners based on total scores'
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-codix-gold text-codix-dark rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  {process.step}
                </div>
                <h3 className="text-lg font-semibold text-codix-gold mb-2">
                  {process.title}
                </h3>
                <p className="text-codix-gold/70 text-sm">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Prize Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="card-gold p-8"
        >
          <h2 className="text-2xl font-semibold text-codix-gold mb-6">Prize Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { prize: '🥇 First Place', amount: '₹25,000' },
              { prize: '🥈 Second Place', amount: '₹15,000' },
              { prize: '🥉 Third Place', amount: '₹10,000' },
              { prize: '🏆 Special Awards', amount: '₹5,000 each' }
            ].map((prize, index) => (
              <div key={index} className="text-center p-4 bg-codix-blue/20 rounded-lg">
                <div className="text-2xl mb-2">{prize.prize}</div>
                <div className="text-xl font-bold text-codix-gold">{prize.amount}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final Note */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="card-gold p-8 bg-gradient-to-br from-codix-blue/50 to-codix-dark/50">
            <Scale className="h-12 w-12 text-codix-gold mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-codix-gold mb-3">
              Judges' Decision
            </h3>
            <p className="text-codix-gold/70 max-w-2xl mx-auto">
              The judges' decisions will be final and binding. All projects will be evaluated fairly 
              based on the criteria mentioned above. In case of any disputes, the organizing committee's 
              decision will be final.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Criteria
