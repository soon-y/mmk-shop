import React, { forwardRef, useEffect, useState } from 'react'
import { exist, getCookie, removeCookie, saveCookie } from '../utils/cookiesUtils'
import { useAuth } from '../context/auth'
import { addUserSelection, deleteUserSelection, fetchUserSelection } from '../utils/userUtils'
import type { UserSelectionProps } from '../types'
import { useLocation } from 'react-router-dom'

interface HeartIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'info'> {
  info?: UserSelectionProps
  onClick?: () => void
  classname?: string
  activeInit?: boolean
}

const HeartIcon = forwardRef<SVGSVGElement, HeartIconProps>(
  ({ classname, info, onClick, activeInit, ...props }, ref) => {
    const [active, setActive] = useState<boolean>(activeInit ? activeInit : false)
    const magenta = active ? '#e3007f' : '#818181'
    const cyan = active ? '#00a0e8' : '#818181'
    const { user } = useAuth()
    const pathname = useLocation().pathname

    useEffect(() => {
      if (typeof active === 'boolean') setActive(activeInit!)
    }, [activeInit])

    useEffect(() => {
      const checkFavorite = async () => {
        if (!info) return

        let favorites: UserSelectionProps[] = []

        if (user) {
          const res = await fetchUserSelection('favorites', user.id)
          if (res && Array.isArray(res)) {
            favorites = res
          }
        } else {
          const favoritesRaw = getCookie('favorites')
          if (favoritesRaw) {
            try {
              favorites = JSON.parse(favoritesRaw)
            } catch {
              favorites = []
            }
          }
        }

        const existing = exist(favorites, info)

        setActive(existing > -1)
      }

      checkFavorite()
    }, [info, user])

    const handleFavorite = async () => {
      if (!info) return

      setActive(prev => !prev)

      if (!active) {
        if (user) {
          addUserSelection('favorites', user.id, info)
        } else {
          saveCookie('favorites', info)
        }
        if (pathname.includes('cart')) {
          removeCookie('cart', info)
          window.location.reload()
        }
      } else {
        if (user) {
          deleteUserSelection('favorites', user.id, info)
        } else {
          removeCookie('favorites', info)
        }
      }

      if (pathname.includes('favorites')) {
        window.location.reload()
      }
    }

    return (
      <svg
        aria-label="heart"
        role="img"
        viewBox="-25 0 530 280"
        width="24"
        height="24"
        ref={ref}
        onClick={onClick ? onClick : () => {
          handleFavorite()
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
