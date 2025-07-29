import type { ProductSortedProps } from '../../types'
import { getQntFromCartCookie } from '../../utils/cookiesUtils'
import { getQntFromUserCart } from '../../utils/userUtils'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { useState, useEffect } from 'react'

function AddToCartBox({ product, sizeIndex, colorIndex, addtoCart }: {
  product: ProductSortedProps,
  sizeIndex: number | null,
  colorIndex: number,
  addtoCart: boolean
}) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [quantity, setQuantity] = useState<number>(0)

  useEffect(() => {
    const fetchQuantity = async () => {
      if (!product || sizeIndex == null || colorIndex == null) return

      const productKey = {
        id: product.id,
        size: sizeIndex,
        color: colorIndex,
      }

      if (user) {
        const res = await getQntFromUserCart(user.id, productKey)
        if (res !== false && typeof res.data === 'number') {
          setQuantity(res.data)
        } else {
          setQuantity(1)
        }
      }
      else {
        const qnt = getQntFromCartCookie(productKey)
        setQuantity(qnt !== undefined ? qnt : 1)
      }
    }

    if (addtoCart) fetchQuantity()
  }, [user, addtoCart])


  return (
    <div>
      {addtoCart && <div className={`fixed inset-0 w-[100vw] h-[100vh] bg-[rgba(255,255,255,0)]`}></div>}
      <div className={`cursor-pointer fixed top-0 right-0 w-[300px] bg-white grid grid-cols-[80px_1fr] p-4 shadow-xl gap-4 bg-gray-50 z-[999] duration-500
        ${addtoCart ? '-translate-x-0' : 'translate-x-full'}
        `}
        onClick={() => navigate('/cart')}
      >
        <img className='rounded-md' src={product.images[colorIndex][0]} />
        <div className='text-sm'>
          <p>{product.name}</p>
          <p><span className='mr-6'>Color</span>  {product.color[colorIndex]}</p>
          <p><span className='mr-8'>Size</span>  {product.size[sizeIndex === null ? 0 : sizeIndex]}</p>
          <p><span className='mr-2'>Qunatity</span>{quantity}</p>
        </div>
      </div>
    </div>
  )
}

export default AddToCartBox