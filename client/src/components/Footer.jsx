import { Link } from 'react-router-dom'
import { Code, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass-morphism border-t border-codix-gold/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Code className="h-8 w-8 text-codix-gold" />
              <span className="text-2xl font-bold text-gradient">CODIX Hackathon</span>
            </div>
            <p className="text-codix-gold/70 mb-4">
              Where innovation meets technology. Join us for an exciting journey of creativity, 
              problem-solving, and cutting-edge development.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-codix-gold hover:text-codix-light transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-codix-gold hover:text-codix-light transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-codix-gold hover:text-codix-light transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-codix-gold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-codix-gold/70 hover:text-codix-gold transition-colors duration-300">
                  Register Now
                </Link>
              </li>
              <li>
                <Link to="/rules" className="text-codix-gold/70 hover:text-codix-gold transition-colors duration-300">
                  Rules & Guidelines
                </Link>
              </li>
              <li>
                <Link to="/criteria" className="text-codix-gold/70 hover:text-codix-gold transition-colors duration-300">
                  Judging Criteria
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-codix-gold/70 hover:text-codix-gold transition-colors duration-300">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-codix-gold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-codix-gold" />
                <span className="text-codix-gold/70">Abishek@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-codix-gold" />
                <span className="text-codix-gold/70">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-codix-gold" />
                <span className="text-codix-gold/70">Government Arts And Science College, Kuthalam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-codix-gold/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-codix-gold/70 text-sm">
              © 2024 CODIX Hackathon. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-codix-gold/70 hover:text-codix-gold text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-codix-gold/70 hover:text-codix-gold text-sm transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
