import { useState, useEffect } from 'react'
import { fetchOrder } from '../utils/userUtils'
import { useAuth } from '../context/auth'
import type { OrderProps } from '../types'
import { deliveryDate } from '../utils/orderUtils'
import Button from '../components/ui/button'
import { useNavigate } from 'react-router-dom'

function OrderConfirmation() {
  const { user } = useAuth()
  const naviage = useNavigate()
  const [orderConfirmation, setOrderConfirmation] = useState<OrderProps | null>(null)

  useEffect(() => {
    if (user) {
      fetchOrder(user.id).then((res) => {
        if (res) {
          setOrderConfirmation(res)
        }
      })
    }
  }, [user])

  if (!orderConfirmation) return null

  return (
    <div className="container p-6 grid justify-center">
      <div className="flex flex-col justify-between gap-8 md:w-[500px]">
        <h1 className="my-8">Thank you for your order!</h1>
        <div>
          <div className='grid grid-cols-[110px_1fr] gap-2 md:gap-6'>
            <p>Order number</p>
            <p className='font-bold hover:underline cursor-pointer' onClick={() => naviage(`/account/orders/${orderConfirmation.orderId}`)}>{orderConfirmation.orderId}</p>

            <p>Order total</p>
            <p className='font-bold'>€{orderConfirmation.totalAmount}</p>

            <p>Delivered by</p>
            <div>
              <p className='font-bold'>{deliveryDate(orderConfirmation.created_at!)}</p>
              <p>Standard delivery</p>
            </div>

            <p>Delivered to</p>
            <div>
              <p className='font-bold'>{orderConfirmation.shippingName}</p>
              <p>{orderConfirmation.shippingAddr}</p>
            </div>
          </div>
        </div>

        <div>
          <Button onClick={() => naviage(`/account/orders/${orderConfirmation.orderId}`)}>Track my order</Button>
          <p className='my-6 text-sm text-gray-600 text-center'>
            An email confirmation has been sent to <span className='font-bold'>{user?.email}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
