import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Trophy, Code, Users, FileText, Scale, UserCheck, Mail } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/home', icon: Trophy },
    { name: 'Register', href: '/register', icon: Users },
    { name: 'Rules', href: '/rules', icon: FileText },
    { name: 'Criteria', href: '/criteria', icon: Scale },
    { name: 'Registered Students', href: '/registered-students', icon: UserCheck },
    { name: 'Contact', href: '/contact', icon: Mail },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="glass-morphism sticky top-0 z-50 gold-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2 group">
            <Code className="h-8 w-8 text-codix-gold group-hover:animate-float" />
            <span className="text-2xl font-bold text-gradient">CODIX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                      isActive(item.href)
                        ? 'bg-codix-gold text-codix-dark'
                        : 'text-codix-gold hover:bg-codix-gold/20 hover:text-codix-light'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <Link
                to="/admin/login"
                className="ml-4 px-4 py-2 bg-codix-gold text-codix-dark rounded-md font-medium transition-all duration-300 hover:scale-105"
              >
                Admin
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-codix-gold hover:bg-codix-gold/20 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass-morphism border-t border-codix-gold/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-300 flex items-center space-x-2 ${
                    isActive(item.href)
                      ? 'bg-codix-gold text-codix-dark'
                      : 'text-codix-gold hover:bg-codix-gold/20 hover:text-codix-light'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium bg-codix-gold text-codix-dark"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
