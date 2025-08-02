import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import axios, { type AxiosResponse } from 'axios'
import { fetchAddress, fetchBillingAddr, fetchCustomer } from '../utils/profileUtils'
import type { AddrProps, UserProps } from '../types'
import { deleteCookie, getCookie } from '../utils/cookiesUtils'
import { getCookiesProducts } from '../utils/productUtils'

interface UserContextType {
  user: UserProps | null
  addr: AddrProps[] | null
  billingAddr: AddrProps[] | null
  isUserenticated: boolean
  loading: boolean
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>
  login: (email: string, password: string) => Promise<AxiosResponse | 'unauthorized' | null>
  refreshUser: () => Promise<void>
  logout: () => void
  syncLocalData: (user: UserProps) => Promise<void>
  updateInfo: (id: string, info: Record<string, any>) => Promise<boolean>
  updateAddr: (id: string, index: number, info: Record<string, any>) => Promise<boolean>
  updateBillingAddr: (id: string, index: number, info: Record<string, any>) => Promise<boolean>
  addAddr: (info: Record<string, any>) => Promise<boolean>
  addBillingAddr: (info: Record<string, any>) => Promise<boolean>
}

const UserContext = createContext<UserContextType>({
  user: null,
  addr: null,
  billingAddr: null,
  isUserenticated: false,
  loading: true,
  setUser: () => { },
  login: async () => null,
  refreshUser: async () => { },
  logout: () => { },
  syncLocalData: async () => { },
  updateInfo: async () => false,
  updateAddr: async () => false,
  updateBillingAddr: async () => false,
  addAddr: async () => false,
  addBillingAddr: async () => false,
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null)
  const [addr, setAddr] = useState<AddrProps[] | null>(null)
  const [billingAddr, setBillingAddr] = useState<AddrProps[] | null>(null)
  const [isUserenticated, setIsUserenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const token = localStorage.getItem('MMKtoken')
    if (!token) {
      setIsUserenticated(false)
      setUser(null)
      return
    }

    try {
      const result = await fetchCustomer()
      if (result === false) {
        setIsUserenticated(false)
        setUser(null)
        localStorage.removeItem('MMKtoken')
      } else {
        setIsUserenticated(true)
        setUser(result.data)

        const addr = await fetchAddress(result.data.id)
        if (addr && (addr.status === 200 || addr.status === 201)) {
          setAddr(addr.data)
        }

        const billingAddr = await fetchBillingAddr(result.data.id)
        if (billingAddr && (billingAddr.status === 200 || billingAddr.status === 201)) {
          setBillingAddr(billingAddr.data)
        }

      }
    } catch {
      setIsUserenticated(false)
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
    setIsUserenticated(false)
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

  const updateInfo = async (
    id: string,
    info: Record<string, any>
  ): Promise<boolean> => {
    try {
      const res = await axios.post('https://mmk-backend.onrender.com/users/updateInfo', { id, info })
      if (res.status === 200 || res.status === 201) {
        await refreshUser()
        return true
      }
      return false
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Update failed:', err.message)
      } else {
        console.error('Unexpected error:', err)
      }
      return false
    }
  }

  const updateAddr = async (
    id: string, index: number,
    info: Record<string, any>
  ): Promise<boolean> => {
    try {
      const res = await axios.post('https://mmk-backend.onrender.com/users/updateAddr', { id, index, info })
      if (res.status === 200 || res.status === 201) {
        await refreshUser()
        return true
      }
      return false
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Update failed:', err.message)
      } else {
        console.error('Unexpected error:', err)
      }
      return false
    }
  }

  const updateBillingAddr = async (
    id: string, index: number,
    info: Record<string, any>
  ): Promise<boolean> => {
    try {
      const res = await axios.post('https://mmk-backend.onrender.com/users/updateBillingAddr', { id, index, info })
      if (res.status === 200 || res.status === 201) {
        await refreshUser()
        return true
      }
      return false
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Update failed:', err.message)
      } else {
        console.error('Unexpected error:', err)
      }
      return false
    }
  }

  const addAddr = async (info: Record<string, any>): Promise<boolean> => {
    try {
      const res = await axios.post('https://mmk-backend.onrender.com/users/addAddr', { info })
      if (res.status === 200 || res.status === 201) {
        await refreshUser()
        return true
      }
      return false
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Update failed:', err.message)
      } else {
        console.error('Unexpected error:', err)
      }
      return false
    }
  }

  const addBillingAddr = async (info: Record<string, any>): Promise<boolean> => {
    try {
      const res = await axios.post('https://mmk-backend.onrender.com/users/addBillingAddr', { info })
      if (res.status === 200 || res.status === 201) {
        await refreshUser()
        return true
      }
      return false
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Update failed:', err.message)
      } else {
        console.error('Unexpected error:', err)
      }
      return false
    }
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, isUserenticated, loading, login, logout, refreshUser, syncLocalData, updateInfo, addr, billingAddr, updateAddr, updateBillingAddr, addAddr, addBillingAddr }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
