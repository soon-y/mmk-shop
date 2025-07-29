import { useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import type { SortedOrderProps } from '../types'
import { fetchOrderedProducts, fetchOrders, stringToDate, sortedOrders } from '../utils/orderUtils'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/button'

function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<SortedOrderProps[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [orders, products] = await Promise.all([
            fetchOrders(user.id),
            fetchOrderedProducts(user.id),
          ])

          if (orders && products) {
            sortedOrders(orders, products).then((res) => {
              setOrders(res)
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
    <div>
      <h1 className='p-4'>My purchases</h1>
      {orders ?
        <div>
          {orders.length > 0 ?
            <div className='flex flex-col gap-8 min-h-[calc(100vh-280px)] md:min-h-[calc(100vh-330px)]'>
              {orders.map((el, i) => (
                <div className='cursor-pointer' key={i} onClick={() => navigate(`${el.orderId}`)}>
                  <div className='px-4'>
                    <p className='text-xs text-gray-400 uppercase'>Order: {el.orderId}</p>
                    <p className='py-1 uppercase font-bold'>{el.status}</p>
                    <p className='text-xs'>{stringToDate(el.created_at!)}</p>
                    <p className='font-bold'>€{el.totalAmount}</p>
                  </div>
                  <div className='flex my-2 overflow-x-auto flex-nowrap hide-scrollbar px-4 gap-2'>
                    {el.products.map((p, j) => (
                      <img
                        key={j}
                        src={p.image}
                        alt={p.name}
                        className='w-[22%] rounded-md'
                      />
                    ))}
                  </div>
                  <div className='px-4'>
                    <p>{el.products.length === 1 ? '1 article' : el.products.length + ' articles'}</p>
                    <p className='underline uppercase'>view order</p>
                  </div>
                </div>
              ))}
            </div>
            :
            <div className='p-4 flex items-center h-[calc(100vh-280px)] md:h-[calc(100vh-330px)]'>
              <div className='mb-10'>
                <p className="text-2xl font-semibold">No orders yet</p>
                <p className='mt-12 mb-4'>You'll be able to see zour order history and reorder your favorites here.</p>
                <Button onClick={() => navigate('/')}>Start Shopping</Button>
              </div>
            </div>
          }
          <div className='text-base mt-8 p-4'>
            <span className='uppercase text-gray-500 cursor-pointer hover:underline hover:text-black' onClick={() => navigate('/')}>MMK</span>
            <span className='text-gray-500 mx-2'>/</span>
            <span className='uppercase text-gray-500 cursor-pointer hover:underline hover:text-black' onClick={() => navigate('/account')}>my account</span>
            <span className='text-gray-500 mx-2'>/</span>
            <span className='uppercase font-bold'>my purchases</span>
          </div>
        </div>
        :
        Array.from({ length: 3 }).map((_, i) => (
          <div className='p-4 flex flex-col gap-1 mb-9 animate-pulse' key={i}>
            <p className='bg-gray-100 h-3 w-56'></p>
            <p className='my-1 bg-gray-100 h-5 w-20'></p>
            <p className='bg-gray-100 h-3 w-20'></p>
            <p className='bg-gray-100 h-4 w-12'></p>
            <div className='flex gap-2 my-2'>
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className='w-[21%] aspect-square bg-gray-100 rounded-md'></div>
              ))}
            </div>
            <p className='bg-gray-100 h-4 w-20'></p>
            <p className='bg-gray-100 h-4 w-20'></p>
          </div>
        ))
      }
    </div>
  )
}

export default Orders
