import React, { forwardRef } from 'react'
import type { UserSelectionProps } from '../types'
import { useFavorites } from '../context/favorites'

interface HeartIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'info'> {
  info?: UserSelectionProps
  onClick?: () => void
  classname?: string
  activeInit?: boolean
}

const HeartIcon = forwardRef<SVGSVGElement, HeartIconProps>(
  ({ classname, info, onClick, activeInit, ...props }, ref) => {
    const { isFavorite, toggleFavorite, loadFavorites } = useFavorites()
    const active = info ? isFavorite(info) : activeInit
    const magenta = active ? '#e3007f' : '#818181'
    const cyan = active ? '#00a0e8' : '#818181'

    return (
      <svg
        aria-label="heart"
        role="img"
        viewBox="-25 0 530 280"
        width="24"
        height="24"
        ref={ref}
        onClick={onClick ? onClick : () => {
          toggleFavorite(info!)
          loadFavorites()
        }}
        className={`${classname} duration-500 cursor-pointer`}
        {...props}
      >
        <path fill="white" d="m17 138l207 202 207-202-119-120-88 80-89-80z" />
        <g transform="rotate(45, 224, 180)">
          <path
            fill="none"
            stroke='white'
            strokeWidth={100}
            d="m54 111h291c2.8 0 5 2.2 5 5v166c0 2.8-2.2 5-5 5h-291c-2.8 0-5-2.2-5-5v-166c0-2.8 2.2-5 5-5zm4 10l284 158"
          />
          <g transform="rotate(-90, 200, 136)">
            <path
              fill="none"
              stroke='white'
              strokeWidth={100}
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
