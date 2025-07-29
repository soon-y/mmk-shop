import React, { createContext, useContext, useState, useEffect } from 'react'
import { addUserSelection, deleteUserSelection } from '../utils/userUtils'
import { saveCookie, removeCookie } from '../utils/cookiesUtils'
import type { ProductSortedProps, UserSelectionProps } from '../types'
import { useAuth } from './auth'
import { exist } from '../utils/cookiesUtils'
import { getCookiesProducts, getUserProducts } from '../utils/productUtils'

interface FavoritesContextType {
  favorites: UserSelectionProps[]
  favoritesProducts: ProductSortedProps[]
  toggleFavorite: (item: UserSelectionProps) => void
  isFavorite: (item: UserSelectionProps) => boolean
  loadFavorites: () => Promise<void>
  loading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)
  const [favorites, setFavorites] = useState<UserSelectionProps[]>([])
  const [favoritesProducts, setFavoritesProducts] = useState<ProductSortedProps[]>([])

  const loadFavorites = async () => {
    if (user) {
      const { userItem, filtered } = await getUserProducts('favorites', user.id)
      setFavorites(userItem)
      setFavoritesProducts(filtered)
      setLoading(false)
    } else {
      const { cookiesItem, filtered } = await getCookiesProducts('favorites')
      setFavorites(cookiesItem)
      setFavoritesProducts(filtered)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFavorites()
  }, [user])

  const toggleFavorite = async (item: UserSelectionProps) => {
    const index = exist(favorites, item)

    if (index >= 0) {
      if (user) {
        await deleteUserSelection('favorites', user.id, item)
      } else {
        removeCookie('favorites', item)
      }
    } else {
      if (user) {
        await addUserSelection('favorites', user.id, item)
      } else {
        saveCookie('favorites', item)
      }
    }

    await loadFavorites()
  }


  const isFavorite = (item: UserSelectionProps) => {
    return exist(favorites, item) > -1
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, favoritesProducts, loadFavorites, loading }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider')
  return context
}
