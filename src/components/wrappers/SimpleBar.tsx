import React from 'react'

export const SimpleBar: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`overflow-y-auto ${className}`}>
      {children}
    </div>
  )
}

export default SimpleBar
