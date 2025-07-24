import React, { forwardRef } from 'react'

interface MenuIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean
  onClick?: () => void
}

const MenuIcon = forwardRef<SVGSVGElement, MenuIconProps>(
  ({ active = false, onClick, ...props }, ref) => {
    const magenta = active ? '#e3007f' : '#818181'
    const cyan = active ? '#00a0e8' : '#818181'

    return (
      <svg
        aria-label="menu"
        role="img"
        viewBox="-20 0 350 257"
        width="20"
        height="20"
        ref={ref}
        onClick={onClick}
        {...props}
      >
        <path
          fill="white"
          stroke="white"
          strokeWidth={90}
          strokeLinecap="round"
          d="m22 27h254"
        />

        <path
          fill="white"
          stroke="white"
          strokeWidth={90}
          strokeLinecap="round"
          d="m22 130h254"
        />

        <path
          fill="white"
          stroke="white"
          strokeWidth={90}
          strokeLinecap="round"
          d="m22 233h254"
        />

        <path
          fill="none"
          stroke={magenta}
          strokeWidth={40}
          strokeLinecap="round"
          d="m22 27h254"
        />

        <path
          fill="none"
          stroke={cyan}
          strokeWidth={40}
          strokeLinecap="round"
          d="m22 130h254"
        />

        <path
          fill="none"
          stroke={magenta}
          strokeWidth={40}
          strokeLinecap="round"
          d="m22 233h254"
        />

      </svg>
    )
  }
)

export default MenuIcon
