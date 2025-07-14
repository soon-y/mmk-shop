import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import axios, { type AxiosResponse } from 'axios'
import { fetchCustomer } from '../utils/profileUtils'
import type { UserProps } from '../types'

interface AuthContextType {
  user: UserProps | null
  isAuthenticated: boolean
  loading: boolean
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>
  login: (email: string, password: string) => Promise<AxiosResponse | 'unauthorized' | null>
  refreshUser: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  setUser: () => {},
  login: async () => null,
  refreshUser: async () => {},
  logout: () => {}
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
      const res = await axios.post('http://localhost:3000/auth/loginCustomer', { email, password })

      if (res.status === 200 || res.status === 201) {
        localStorage.setItem('MMKtoken', res.data.access_token)
        await refreshUser()
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

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
