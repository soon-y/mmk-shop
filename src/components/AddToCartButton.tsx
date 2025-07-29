import type { ProductSortedProps } from '../types'
import Button from './ui/button'
import { useCart } from '../context/cart'
import { useFavorites } from '../context/favorites'

function AddToCartButton({ product, sizeIndex, colorIndex, setAddtoCart, setClicked }: {
  product: ProductSortedProps,
  sizeIndex: number | null,
  colorIndex: number,
  setAddtoCart: React.Dispatch<React.SetStateAction<boolean>>
  setClicked?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { addProduct } = useCart()
  const { loadFavorites } = useFavorites()

  const addtoCart = async () => {
    addProduct(product.id, sizeIndex!, colorIndex)
    setClicked?.(false)

    setTimeout(() => {
      setAddtoCart(true)
      setTimeout(() => {
        setTimeout(() => {
          setAddtoCart(false)
          loadFavorites()
        }, 1500)
      }, 100)
    }, 100)
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