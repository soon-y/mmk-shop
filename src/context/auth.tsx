import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import axios, { type AxiosResponse } from 'axios'
import { fetchCustomer } from '../utils/profileUtils'
import type { UserProps } from '../types'
import { deleteCookie, getCookie } from '../utils/cookiesUtils'
import { getCookiesProducts } from '../utils/productUtils'

interface AuthContextType {
  user: UserProps | null
  isAuthenticated: boolean
  loading: boolean
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>
  login: (email: string, password: string) => Promise<AxiosResponse | 'unauthorized' | null>
  refreshUser: () => Promise<void>
  logout: () => void
  syncLocalData: (user: UserProps) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  setUser: () => { },
  login: async () => null,
  refreshUser: async () => { },
  logout: () => { },
  syncLocalData: async () => { },
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const token = localStorage.getItem('MMKtoken')
    if (!token) {
      setIsAuthenticated(false)
      setUser(null)
      return
    }

    try {
      const result = await fetchCustomer()
      if (result === false) {
        setIsAuthenticated(false)
        setUser(null)
        localStorage.removeItem('MMKtoken')
      } else {
        setIsAuthenticated(true)
        setUser(result.data)
      }
    } catch {
      setIsAuthenticated(false)
      setUser(null)
      localStorage.removeItem('MMKtoken')
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string): Promise<AxiosResponse | 'unauthorized' | null> => {
    try {
      const res = await axios.post('https://mmk-backend.onrender.com/auth/loginCustomer', { email, password })

      if (res.status === 200 || res.status === 201) {
        localStorage.setItem('MMKtoken', res.data.access_token)
        await refreshUser()

        const result = await fetchCustomer()
        if (result !== false) {
          syncLocalData(result.data)
        }
        return res
      }

      return null
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          return 'unauthorized'
        }
        console.error('Login failed:', err.message)
      } else {
        console.error('Unexpected error:', err)
      }
      return null
    }
  }

  const logout = () => {
    localStorage.removeItem('MMKtoken')
    setUser(null)
    setIsAuthenticated(false)
  }

  const syncLocalData = async (user: UserProps) => {
    const favorites = getCookie('favorites')
    const cart = getCookie('cart')
    const id = user.id

    if (!id) {
      console.error("No user ID found!")
      return
    }

    if (favorites && favorites.length) {
      try {
        const cookieFavorites = await getCookiesProducts('favorites')

        if (cookieFavorites?.cookiesItem.length) {
          await axios.post('https://mmk-backend.onrender.com/favorites/drop', { user: id })

          for (const item of cookieFavorites.cookiesItem) {
            await axios.post('https://mmk-backend.onrender.com/favorites/add', {
              user: id,
              product: item
            })
          }
        }

        window.location.reload()
      } catch (err) {
        console.error("Failed to sync favorites:", err)
      }
    }

    if (cart && cart.length) {
      try {
        const cookieCart = await getCookiesProducts('cart')

        if (cookieCart?.cookiesItem.length) {
          await axios.post('https://mmk-backend.onrender.com/cart/drop', { user: id })

          for (const item of cookieCart.cookiesItem) {
            await axios.post('https://mmk-backend.onrender.com/cart/add', {
              user: id,
              product: item
            })
          }
        }

        window.location.reload()
      } catch (err) {
        console.error("Failed to sync cart:", err)
      }
    }

    deleteCookie('favorites')
    deleteCookie('cart')
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, loading, login, logout, refreshUser, syncLocalData }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
