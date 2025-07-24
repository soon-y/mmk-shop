import React, { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface CartIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean
}

const CartIcon = forwardRef<SVGSVGElement, CartIconProps>(
  ({ active = false, onClick, ...props }, ref) => {
    const magenta = active ? '#e3007f' : '#818181'
    const cyan = active ? '#00a0e8' : '#818181'
    const navigate = useNavigate()

    return (
      <svg
        aria-label="cart"
        role="img"
        viewBox="-40 -20 400 400"
        width="20"
        height="24"
        ref={ref}
        onClick={() => navigate('/cart')}
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
          strokeLinecap="round"
          d="m93.3 262.1v-171.4c0 0 0.2-74 68.7-74 68.5 0 68.5 74 68.5 74v171.7"
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
          strokeLinecap="round"
          d="m93.3 262.1v-171.4c0 0 0.2-74 68.7-74 68.5 0 68.5 74 68.5 74v171.7"
        />

      </svg>
    )
  }
)

export default CartIcon
