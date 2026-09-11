import React from 'react'
import { 
  X, 
  RotateCcw, 
  Check, 
  Settings, 
  Sun, 
  Moon, 
  Laptop, 
  ChevronRight,
  Sliders
} from 'lucide-react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon?: string
  className?: string
}

export const Icon: React.FC<IconProps> = ({ icon, className = '', ...props }) => {
  switch (icon?.toLowerCase()) {
    case 'x':
      return <X className={className} {...props} />
    case 'refresh':
    case 'rotate-ccw':
      return <RotateCcw className={className} {...props} />
    case 'check':
      return <Check className={className} {...props} />
    case 'settings':
      return <Settings className={className} {...props} />
    case 'sun':
      return <Sun className={className} {...props} />
    case 'moon':
      return <Moon className={className} {...props} />
    case 'laptop':
      return <Laptop className={className} {...props} />
    case 'sliders':
      return <Sliders className={className} {...props} />
    default:
      return <ChevronRight className={className} {...props} />
  }
}

export default Icon
