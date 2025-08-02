import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import { getTotalQntFromCartCookie, removeCookie, saveCookie, updateCookieQnt } from '../utils/cookiesUtils'
import { addUserSelection, deleteUserSelection, dropUserCart, getTotalQntFromUserCart, updateCartQnt } from '../utils/userUtils'
import { getCookiesProducts, getUserProducts } from '../utils/productUtils'
import type { ProductSortedProps, UserSelectionProps } from '../types'

type CartContextType = {
  totalQnt: number
  refreshCart: () => Promise<void>
  products: ProductSortedProps[]
  userSelection: UserSelectionProps[]
  loading: boolean
  updateQnt: (deleteIndex: number, newVal: number) => Promise<void>
  deleteProduct: (deleteIndex: number) => Promise<void>
  addProduct: (id: number, size: number, color: number) => Promise<void>
  dropCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [totalQnt, setTotalQnt] = useState(0)
  const { user } = useAuth()
  const [products, setProducts] = useState<ProductSortedProps[]>([])
  const [userSelection, setUserSelection] = useState<UserSelectionProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const loadCart = async () => {
    if (user) {
      getUserProducts('cart', user.id).then(({ userItem, filtered }) => {
        setUserSelection(userItem)
        setProducts(filtered)
      }).then(() => setLoading(false))
    } else {
      getCookiesProducts('cart').then(({ cookiesItem, filtered }) => {
        setUserSelection(cookiesItem)
        setProducts(filtered)
      })
      setLoading(false)
    }
  }

  const addProduct = async (id: number, size: number, color: number) => {
    if (user) {
      await addUserSelection('cart', user.id, { id: id, size: size, color: color, qnt: 1 })
      await deleteUserSelection('favorites', user.id, { id: id, size: size, color: color })
      refreshCart()
    } else {
      saveCookie('cart', { id: id, size: size, color: color, qnt: 1 })
      removeCookie('favorites', { id: id, size: size, color: color })
      refreshCart()
    }
  }

  const updateQnt = async (deleteIndex: number, newVal: number) => {
    if (user) await updateCartQnt(user.id, deleteIndex, newVal)
    else updateCookieQnt('cart', deleteIndex, newVal)
    await refreshCart()
  }

  const deleteProduct = async (deleteIndex: number) => {
    if (user) await deleteUserSelection('cart', user.id, userSelection[deleteIndex])
    else removeCookie('cart', userSelection[deleteIndex])
    await refreshCart()
  }

  const dropCart = async () => {
    if (user) await dropUserCart(user.id)
    await refreshCart()
  }

  const refreshCart = async () => {
    if (user) {
      const total = await getTotalQntFromUserCart(user.id)
      if (typeof total === 'number') {
        setTotalQnt(total)
      }
    } else {
      setTotalQnt(getTotalQntFromCartCookie())
    }

    await loadCart()
  }

  useEffect(() => {
    setLoading(true)
    loadCart()
  }, [user])

  return (
    <CartContext.Provider value={{ totalQnt, refreshCart, products, userSelection, loading, updateQnt, deleteProduct, addProduct, dropCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)!
