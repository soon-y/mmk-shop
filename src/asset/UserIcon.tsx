import React, { forwardRef } from 'react'

interface UserIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean
  onClick?: () => void
}

const UserIcon = forwardRef<SVGSVGElement, UserIconProps>(
  ({ active = false, onClick, ...props }, ref) => {
    const magenta = active ? '#e3007f' : '#818181'
    const cyan = active ? '#00a0e8' : '#818181'

    return (
      <svg
        aria-label="user"
        role="img"
        viewBox="0 0 320 370"
        width="20"
        height="20"
        ref={ref}
        onClick={onClick}
        {...props}
      >      
         <path style={{ mixBlendMode: 'multiply' }}
            fill="none"
            stroke={magenta}
            strokeWidth={44}
            strokeLinecap="round"
            d="m16.1 173h291c2.8-0.1 5 2.2 5 5v166c0 2.7-2.2 5-5 4.9h-291c-2.8 0.1-5-2.2-5-4.9v-166c0-2.8 2.2-5.1 5-5zm4 10l284 157.9"
          />

          <path style={{ mixBlendMode: 'multiply' }}
            fill="none"
            stroke={cyan}
            strokeWidth={44}
            d="m161.5 149c-35.7 0-64.5-28.8-64.5-64.5 0-35.7 28.8-64.5 64.5-64.5 35.7 0 64.5 28.8 64.5 64.5 0 35.7-28.8 64.5-64.5 64.5z"
          />
          
      </svg>
    )
  }
)

export default UserIcon
