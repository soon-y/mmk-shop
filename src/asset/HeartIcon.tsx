import React, { forwardRef, useEffect } from 'react'
import { removeFavorite, saveFavorite } from '../utils/cookieUtils'

interface HeartIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'info'> {
  info?: string
  active?: boolean | null
  opacity?: number
  onClick?: () => void
}

const HeartIcon = forwardRef<SVGSVGElement, HeartIconProps>(
  ({ info, active = false, opacity, onClick, ...props }, ref) => {
    const magenta = active ? '#e3007f' : '#818181'
    const cyan = active ? '#00a0e8' : '#818181'

    useEffect(() => {
      if (info !== undefined) {
        if (active) {
          saveFavorite(info)
        } else if(active === false) {
          removeFavorite(info)
        }
      }
    }, [active])

    return (
      <svg
        aria-label="heart"
        role="img"
        viewBox="0 0 470 300"
        width="24"
        height="24"
        ref={ref}
        onClick={onClick}
        {...props}
      >
        <path fill="white" d="m17 138l207 202 207-202-119-120-88 80-89-80z" opacity={opacity} />
        <g transform="rotate(45, 224, 180)">
          <path
            fill="none"
            stroke='white'
            strokeWidth={46}
            d="m54 111h291c2.8 0 5 2.2 5 5v166c0 2.8-2.2 5-5 5h-291c-2.8 0-5-2.2-5-5v-166c0-2.8 2.2-5 5-5zm4 10l284 158"
          />
          <g transform="rotate(-90, 200, 136)">
            <path
              fill="none"
              stroke='white'
              strokeWidth={46}
              d="m54 111h291c2.8 0 5 2.2 5 5v166c0 2.8-2.2 5-5 5h-291c-2.8 0-5-2.2-5-5v-166c0-2.8 2.2-5 5-5zm4 10l284 158"
            />
          </g>

          <path style={{ mixBlendMode: 'multiply' }}
            fill="none"
            stroke={magenta}
            strokeWidth={46}
            d="m54 111h291c2.8 0 5 2.2 5 5v166c0 2.8-2.2 5-5 5h-291c-2.8 0-5-2.2-5-5v-166c0-2.8 2.2-5 5-5zm4 10l284 158"
          />
          <g transform="rotate(-90, 200, 136)" style={{ mixBlendMode: 'multiply' }}>
            <path
              fill="none"
              stroke={cyan}
              strokeWidth={46}
              d="m54 111h291c2.8 0 5 2.2 5 5v166c0 2.8-2.2 5-5 5h-291c-2.8 0-5-2.2-5-5v-166c0-2.8 2.2-5 5-5zm4 10l284 158"
            />
          </g>
        </g>
      </svg>
    )
  }
)

export default HeartIcon
