import { Loader2 } from 'lucide-react'

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 
        className={`${sizeClasses[size]} text-codix-gold animate-spin`} 
      />
      {text && (
        <span className="text-codix-gold animate-pulse">{text}</span>
      )}
    </div>
  )
}

export default Loader
