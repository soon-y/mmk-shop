import React, { forwardRef } from 'react'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'

interface UserIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
}

const UserIcon = forwardRef<SVGSVGElement, UserIconProps>(
  ({ active = false, setClicked, ...props }, ref) => {
    const magenta = active ? '#e3007f' : '#818181'
    const cyan = active ? '#00a0e8' : '#818181'
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const HandleClicked = () => {
      if (isAuthenticated) {
        setClicked(false)
        navigate('/account')
      } else setClicked(true)
    }

    return (
      <svg
        aria-label="user"
        role="img"
        viewBox="-40 -20 400 400"
        width="20"
        height="24"
        ref={ref}
        onClick={HandleClicked}
        {...props}
      >
        <path
          fill="white"
          stroke="white"
          strokeWidth={90}
          strokeLinecap="round"
          d="m16.1 173h291c2.8-0.1 5 2.2 5 5v166c0 2.7-2.2 5-5 4.9h-291c-2.8 0.1-5-2.2-5-4.9v-166c0-2.8 2.2-5.1 5-5zm4 10l284 157.9"
        />

        <path
          fill="white"
          stroke="white"
          strokeWidth={90}
          d="m161.5 149c-35.7 0-64.5-28.8-64.5-64.5 0-35.7 28.8-64.5 64.5-64.5 35.7 0 64.5 28.8 64.5 64.5 0 35.7-28.8 64.5-64.5 64.5z"
        />

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
