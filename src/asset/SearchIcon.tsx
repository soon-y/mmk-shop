import React, { forwardRef } from 'react'

interface SearchIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean
  onClick?: () => void
}

const SearchIcon = forwardRef<SVGSVGElement, SearchIconProps>(
  ({ active = false, onClick, ...props }, ref) => {
    const magenta = active ? '#e3007f' : '#818181'
    const cyan = active ? '#00a0e8' : '#818181'

    return (
      <svg
        aria-label="search"
        role="img"
        viewBox="0 0 350 300"
        width="20"
        height="24"
        ref={ref}
        onClick={onClick}
        {...props}
      >
        <g transform="rotate(-45, 130, 120)">
          <path style={{ mixBlendMode: 'multiply' }}
            fill='none'
            stroke={magenta}
            strokeWidth={40}
            d="m138.5 264c-70 0-126.5-56.5-126.5-126.5 0-70 56.5-126.5 126.5-126.5 70 0 126.5 56.5 126.5 126.5 0 70-56.5 126.5-126.5 126.5z"
          />
          <g style={{ mixBlendMode: 'multiply' }}>
            <path
              fill={cyan}
              stroke={cyan}
              strokeWidth={18}
              d="m139 255c6.1 0 11 4.9 11 11v120c0 6.1-4.9 11-11 11-6.1 0-11-4.9-11-11v-120c0-6.1 4.9-11 11-11z"
            />
          </g>
        </g>
      </svg>
    )
  }
)

export default SearchIcon
