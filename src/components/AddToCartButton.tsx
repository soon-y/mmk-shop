import type { ProductSortedProps } from '../types'
import { removeCookie, saveCookie } from '../utils/cookiesUtils'
import Button from './ui/button'
import { useAuth } from '../context/auth'
import { useLocation } from 'react-router-dom'
import { addUserSelection, deleteUserSelection } from '../utils/userUtils'

function AddToCartButton({ product, sizeIndex, colorIndex, setAddtoCart, setClicked }: {
  product: ProductSortedProps,
  sizeIndex: number | null,
  colorIndex: number,
  setAddtoCart: React.Dispatch<React.SetStateAction<boolean>>
  setClicked?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { user } = useAuth()
  const pathname = useLocation().pathname

  const addtoCart = () => {
    if (user) {
      addUserSelection('cart', user.id, { id: product.id, size: sizeIndex!, color: colorIndex, qnt: 1 })
      deleteUserSelection('favorites', user.id, { id: product.id, size: 0, color: colorIndex })
    } else {
      saveCookie('cart', { id: product.id, size: sizeIndex!, color: colorIndex, qnt: 1 })
      removeCookie('favorites', { id: product.id, size: 0, color: colorIndex })
    }

    setAddtoCart(true)
    setClicked?.(false)

    setTimeout(() => {
      setAddtoCart(false)
      if (pathname.includes('favorites')) window.location.reload()
    }, 1500)
  }

  return (
    <div>
      <Button onClick={addtoCart} disabled={(sizeIndex === null) || (sizeIndex !== null && product.stock[sizeIndex][colorIndex] === 0)}>
        {(sizeIndex !== null && product.stock[sizeIndex][colorIndex] === 0) ? 'Out of product.stock' : 'Add'}
      </Button>
    </div>
  )
}

export default AddToCartButton