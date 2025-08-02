import { useState, useEffect } from 'react'
import Button from '../components/ui/button'
import type { UserSelectionProps, ProductSortedProps } from '../types'
import QuantityInput from '../components/ui/quantityInput'
import HeartIcon from '../asset/HeartIcon'
import { useNavigate } from 'react-router-dom'
import { getCategoryGroupName } from '../utils/categoryUtils'
import RecentView from '../components/RecentView'
import { useAuth } from '../context/auth'
import LoginPopup from '../components/LoginPopup'
import OrderValue from '../components/cart/orderValue'
import PayPal from '../asset/PayPal'
import Visa from '../asset/Visa'
import Master from '../asset/Master'
import Klarna from '../asset/Klarna'
import { useCart } from '../context/cart'
import RightSidePanel from '../components/RightSidePanel'

function Cart() {
  const navigate = useNavigate()
  const [loginClicked, setLoginClicked] = useState<boolean>(false)
  const [openShippingInfo, setOpenShippingInfo] = useState<boolean>(false)
  const [productsInCart, setProductsInCart] = useState<ProductSortedProps[]>([])
  const [userCart, setUserCart] = useState<UserSelectionProps[]>([])
  const { isAuthenticated } = useAuth()
  const { products, userSelection, loading } = useCart()

  useEffect(() => {
    setProductsInCart(products)
    setUserCart(userSelection)
  }, [products, userSelection])

  return (
    <div>
      <div className='containerWoHeight px-4 md:px-6 pb-10'>
        <h1>Cart</h1>
        <div className='gap-4 grid grid-rows md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_400px]'>
          <div className='flex flex-col gap-4'>
            {!loading ?
              productsInCart.length > 0 ?
                productsInCart.map((item, i) => (
                  <div className='grid grid-cols-[170px_1fr] gap-4 items-center cursor-pointer' key={i}>
                    <div className='relative'>
                      {item.imagesCount.length > 0 && userCart.length > 0 &&
                        <img className='rounded-md' src={item.images[userCart[i].color][0]}
                          onClick={() => navigate(`/products/item?group=${getCategoryGroupName(item.category)}&id=${item.id}&color=${userCart[i].color}`)}
                        />}
                      <HeartIcon classname='absolute top-1 right-2' info={userCart[i]} />
                    </div>
                    <div>
                      <p>{item.name}</p>
                      <div className='flex gap-2'>
                        <p className='font-bold'>€ {item.discount.toFixed(2)}</p>
                        {item.discount !== item.price &&
                          <p className='text-gray-400 font-bold line-through'>€ {item.price.toFixed(2)}
                          </p>
                        }
                      </div>
                      <div className='text-xs/4 my-2 grid grid-cols-[70px_1fr]'>
                        <p>Color</p><p>{item.color[userCart[i].color]}</p>
                        <p>Size</p><p>{item.size[userCart[i].size]}</p>
                        <p>Quantity</p><p>{userCart[i].qnt === 0 ? 1 : userCart[i].qnt}</p>
                        <p>Total</p>
                        <p className='font-bold'>{userCart[i].qnt === 0 ? item.discount.toFixed(2) : (item.discount * userCart[i].qnt!).toFixed(2)} €</p>
                      </div>
                      <QuantityInput index={i} max={item.stock[userCart[i].size][userCart[i].color]} />
                    </div>
                  </div>
                ))
                :
                <div>
                  <p className='text-gray-400 font-semibold uppercase'>Your shopping bag is empty.</p>
                  {!isAuthenticated &&
                    <p>Log in to add items to your shopping bag or access items you've already added.</p>
                  }
                </div>
              :
              Array.from({ length: 3 }).map((_, i) => (
                <div className='animate-pulse grid grid-cols-[170px_1fr] gap-4 items-center' key={i}>
                  <div className='w-full aspect-square rounded-md bg-gray-100'></div>
                  <div>
                    <p className='w-32 h-5 bg-gray-100 rounded-sm'></p>
                    <p className='w-20 h-5 bg-gray-100 rounded-sm my-2'></p>
                    <p className='w-20 h-4 bg-gray-100 rounded-sm my-2'></p>
                    <p className='w-20 h-4 bg-gray-100 rounded-sm my-2'></p>
                    <p className='w-20 h-4 bg-gray-100 rounded-sm my-2'></p>
                    <p className='w-20 h-4 bg-gray-100 rounded-sm my-2'></p>
                    <p className='w-20 h-4 bg-gray-100 rounded-sm'></p>
                  </div>
                </div>
              ))
            }
          </div>

          <div className='flex flex-col gap-4 sticky top-[90px] md:top-[160px] self-start'>
            {productsInCart.length > 0 && <OrderValue />}
            {isAuthenticated ?
              <Button disabled={productsInCart.length === 0} onClick={() => navigate('/checkout')}>continue to checkout</Button> :
              <Button onClick={() => setLoginClicked(true)}>log in to checkout</Button>
            }
            <div className='flex gap-4 items-center'>
              <Klarna /><Visa /> <Master /> <PayPal />
            </div>

            <p className='text-sm'>Prices and shipping costs will not be confirmed until you complete your purchase.</p>
            <p className='text-sm'>Further information on <span className='underline'>returns and refunds</span>.</p>
            <p className='text-sm'>Do you need help? Please contact <span className='underline cursor-pointer' onClick={() => navigate('/customer-service')}>customer service</span>.</p>
            <p className='uppercase underline cursor-pointer' onClick={() => setOpenShippingInfo(true)}>Shipping and return options</p>

          </div>
        </div>

        {loginClicked &&
          <LoginPopup setClicked={setLoginClicked} />
        }
      </div>

      <RecentView />

      <RightSidePanel title='Shipping and return options' clicked={openShippingInfo} setClicked={setOpenShippingInfo}>
        <div className='p-6 flex flex-col gap-2'>
          <p className='uppercase'>Shipment</p>
          <ul className='text-sm'>
            <li>
              Standard shipping: €1.49, free for orders over €50
            </li>
            <li>
              Delivery within 2-4 business days.
            </li>
            <li>
              The current delivery time for your order will be displayed at checkout and on your order confirmation.
            </li>
          </ul>

          <p className='uppercase'>Return</p>
          <ul className='text-sm'>
            <li>You can return your order within 30 days. Sale items can be returned within 14 days of receiving the order.</li>
            <li>The return fee is €2.99 per order</li>
          </ul>

          <p className='uppercase'>You can find more information on our customer service page under Delivery or Returns.</p>
        </div>
      </RightSidePanel>
    </div>
  )
}

export default Cart