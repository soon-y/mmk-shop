import { useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import type { SortedOrderProps } from '../types'
import { fetchOrderedProducts, fetchThisOrder, stringToDate, sortedOrders } from '../utils/orderUtils'
import { useParams } from 'react-router-dom'
import Dropdown from '../components/ui/dropdown'
import { useNavigate } from 'react-router-dom'
import { urlGenerator } from '../utils/productUtils'
import Button from '../components/ui/button'
import { LockKeyhole } from 'lucide-react'
import Popup from '../components/ui/popup'

function OrderDetail() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<SortedOrderProps>()
  const [openCancelGuide, setOpenCancelGuide] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      if (user && orderId) {
        try {
          const [orders, products] = await Promise.all([
            fetchThisOrder(user.id, orderId),
            fetchOrderedProducts(user.id)
          ])

          if (orders && products) {
            sortedOrders(orders, products).then((res) => {
              setOrder(res[0])
            })
          }
        } catch (err) {
          console.error('Fetching error:', err)
        }
      }
    }

    if (user?.id) {
      fetchData()
    }
  }, [user])

  return (
    <div className="p-4">
      <h1 className='pb-2'>Order information</h1>
      {order && user ?
        <div className='flex flex-col gap-8 md:w-[500px]'>
          <div>
            <p className='font-bold uppercase'>Order code</p>
            <p>{order.orderId}</p>
          </div>

          <div>
            <p className='font-bold uppercase'>Order date</p>
            <p>{stringToDate(order.created_at!)}</p>
          </div>

          <div>
            <p className='font-bold uppercase'>your data</p>
            <p>{user.firstName} {user.lastName}</p>
            <p>{user.email}</p>
          </div>

          <hr />

          <div>
            <p className='font-bold uppercase'>package</p>
            <p>{order.products.length === 1 ? '1 item' : order.products.length + ' items'} from MMK</p>
          </div>

          <div>
            <p className='font-bold'>Estimated delivery</p>
            <p>2-4 working days</p>
          </div>

          <hr />

          <div>
            <p className='font-bold uppercase'>delivery option</p>
            <p>Standard delivery</p>
            <p>{order.shippingAddr.split(' ')[0]}</p>
            <p>{order.shippingAddr.split(' ')[1]}</p>
            <p>{order.shippingAddr.split(' ')[2]}</p>
            <p>{order.shippingAddr.split(' ')[3]}</p>
          </div>

          <hr />

          <div>
            <p className='text-gray-500 uppercase'>1 - receive order</p>
            <p>{stringToDate(order.created_at!)}</p>
          </div>
          <div>
            <p className='text-gray-500 uppercase'>2 - processing completed</p>
            <p>{order.dateProcessingCompleted ? stringToDate(order.dateProcessingCompleted) : 'In progress'}</p>
          </div>
          <div>
            <p className='text-gray-500 uppercase'>3 - shipped</p>
            <p>{order.dateShipped ? stringToDate(order.dateShipped) : 'In progress'}</p>
          </div>
          <div>
            <p className='text-gray-500 uppercase'>4 - delivered</p>
            <p>{order.dateDelivered ? stringToDate(order.dateDelivered) : 'In progress'}</p>
          </div>

          <Dropdown title={`order overview - ${order.products.length === 1 ? '1 item' : order.products.length + ' items'}`}
            classname='text-black my-4'>

            <div className='flex flex-col gap-4'>
              {order.products.map((el, i) => (
                <div key={i} className='cursor-pointer grid grid-cols-[200px_1fr] gap-2' onClick={() => navigate(urlGenerator(el.categoryGroup, el.id, el.colorIndex))}>
                  <img src={el.image} className='rounded-md' />
                  <div className='flex flex-col gap-2'>
                    <div className='text-base'>
                      <p className='uppercase font-semibold'>{el.name}</p>
                      <p><span className='font-bold'>{el.price}</span> €</p>
                    </div>

                    <div className='grid grid-cols-[70px_1fr] text-sm'>
                      <p>Color</p> <p>{el.color}</p>
                      <p>Size</p> <p>{el.color}</p>
                      <p>Quantity</p> <p>{el.qnt}</p>
                      <p>Total</p> <p><span className='font-bold'>{el.total}</span> €</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Dropdown>

          <hr />
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <p>Order value</p>
              <p><span className='font-bold'>{order.totalAmount}</span> €</p>
            </div>
            <div className='flex justify-between'>
              <p>Discount</p>
              <p className='text-red-500'><span className='font-bold'>- {order.discount}</span> €</p>
            </div>
            <div className='flex justify-between'>
              <p>Shipping fee</p>
              <p><span className='font-bold'>{order.shippingFee}</span> €</p>
            </div>
            <div className='flex justify-between text-base my-4'>
              <p className='uppercase font-bold'>Total</p>
              <p><span className='font-bold'>{order.paidAmount}</span> €</p>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <Button disabled={order.dateProcessingCompleted !== null}>cancel order</Button>
            <p className='text-sm mt-4 flex items-center justify-center'>
              <LockKeyhole className='w-4 mr-2' />
              All data is stored securely. Payment details are encrypted.
            </p>
            {order.dateProcessingCompleted !== null && <p className='cursor-pointer uppercase underline' onClick={() => setOpenCancelGuide(true)}>
              why can't I cancel my order?
            </p>}

          </div>

          <Button classname='border'>online receipt</Button>

          <div className='text-base mt-10'>
            <span className='uppercase text-gray-500 cursor-pointer hover:underline hover:text-black' onClick={() => navigate('/')}>MMK</span>
            <span className='text-gray-500 mx-2'>/</span>
            <span className='uppercase text-gray-500 cursor-pointer hover:underline hover:text-black' onClick={() => navigate('/account')}>my account</span>
            <span className='text-gray-500 mx-2'>/</span>
            <span className='uppercase text-gray-500 cursor-pointer hover:underline hover:text-black' onClick={() => navigate('/account/orders')}>my purchases</span>
            <span className='text-gray-500 mx-2'>/</span>
            <span className='uppercase font-bold'>order information</span>
          </div>
        </div>
        :
        <div className='animate-pulse flex flex-col gap-8'>
          {Array.from({ length: 2 }).map((_, i) => (
            <div className='flex flex-col gap-2' key={i}>
              <p className='bg-gray-100 h-5 w-24'></p>
              <p className='bg-gray-100 h-5 w-56'></p>
            </div>
          ))}
          <div className='flex flex-col gap-2'>
            <p className='bg-gray-100 h-5 w-24'></p>
            <p className='bg-gray-100 h-5 w-56'></p>
            <p className='bg-gray-100 h-5 w-56'></p>
          </div>

          <hr />

          {Array.from({ length: 2 }).map((_, i) => (
            <div className='flex flex-col gap-2' key={i}>
              <p className='bg-gray-100 h-5 w-24'></p>
              <p className='bg-gray-100 h-5 w-56'></p>
            </div>
          ))}

          <hr />

          <div className='flex flex-col gap-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <p className='bg-gray-100 h-5 w-56' key={i}></p>
            ))}
          </div>

          <hr />
        </div>
      }

      {openCancelGuide &&
        <Popup title={"WHY CAN'T I CANCEL MY ORDER?"} setClicked={setOpenCancelGuide}>
          <p>Cancellation may not be possible for the following reasons:
            1. The cancellation period has not yet begun. Please try again in 5 minutes.
            2. If your order is already being processed, you cannot return it until you receive it.
          </p>

          <div className='grid grid-cols-[1fr_70px] gap-2 mt-8'>
            <Button onClick={() => navigate('/customer-service')}>customer service</Button>
            <Button onClick={() => setOpenCancelGuide(false)}>ok</Button>
          </div>
        </Popup>
      }
    </div>
  )
}

export default OrderDetail
