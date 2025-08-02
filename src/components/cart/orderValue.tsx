import { useState, useEffect } from 'react'
import type { UserSelectionProps, ProductSortedProps } from '../../types'
import { CircleQuestionMark } from 'lucide-react'
import { useCart } from '../../context/cart'

function OrderValue() {
  const [productsInCart, setProductsInCart] = useState<ProductSortedProps[]>([])
  const [userCart, setUserCart] = useState<UserSelectionProps[]>([])
  const [total, setTotal] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0)
  const { products, userSelection, loading } = useCart()

  useEffect(() => {
    setProductsInCart(products)
    setUserCart(userSelection)
  }, [products, userSelection])

  useEffect(() => {
    let total = 0
    let discount = 0

    userCart.forEach((el, i) => {
      const quantity = el.qnt ?? 1
      total += quantity * productsInCart[i].price
      discount += quantity * productsInCart[i].discount
    })

    const deliveryCharge = total >= 50 ? 0 : 1.49
    setDiscount(total-discount)
    setTotal(total)
    setDeliveryCharge(deliveryCharge)
  }, [userCart])

  return (
    <div>
      {loading ?
        <div className='animate-pulse flex flex-col gap-2'>
          <p className='bg-gray-100 h-5 w-full rounded-sm'></p>
          <p className='bg-gray-100 h-5 w-full rounded-sm'></p>
          <p className='bg-gray-100 h-5 w-full rounded-sm'></p>
          <p className='bg-gray-100 h-5 w-full rounded-sm mt-2 mb-1'></p>
        </div>
        :
        <div>
          <div>
            <div className='flex justify-between'>
              <p>Order value</p>
              <p className='font-bold'>{total.toFixed(2)} €</p>
            </div>
            <div className='flex justify-between'>
              <p>Discount</p>
              <p className='font-bold text-red-500'>- {discount.toFixed(2)} €</p>
            </div>
            <div className='flex justify-between mb-2'>
              <div>
                <p>Estimated delivery charge</p>
                {deliveryCharge !== 0 &&
                  <p className='text-gray-400 text-xs'>
                    <CircleQuestionMark className='inline-block w-4' /> Free for orders over €30
                  </p>}
              </div>
              <p className='font-bold'>{deliveryCharge} €</p>
            </div>
          </div>

          <div className='flex justify-between my-4'>
            <p>TOTAL</p>
            <p className='font-bold'>{(total - discount + deliveryCharge).toFixed(2)} €</p>
          </div>
        </div>
      }
    </div>
  )
}

export default OrderValue