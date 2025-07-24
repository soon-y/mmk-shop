import { useState, useEffect } from 'react'
import Button from '../components/ui/button'
import type { UserSelectionProps, ProductSortedProps } from '../types'
import { getCookiesProducts, getUserProducts } from '../utils/productUtils'
import QuantityInput from '../components/ui/quantityInput'
import HeartIcon from '../asset/HeartIcon'
import { removeCookie } from '../utils/cookiesUtils'
import { useNavigate } from 'react-router-dom'
import { getCategoryGroupName } from '../utils/categoryUtils'
import { CircleQuestionMark } from 'lucide-react'
import Popup from '../components/ui/popup'
import RecentView from '../components/RecentView'
import { useAuth } from '../context/auth'
import { deleteUserSelection } from '../utils/userUtils'
import LoginPopup from '../components/LoginPopup'

function Cart() {
  const navigate = useNavigate()
  const [alertOn, setAlertOn] = useState<boolean>(false)
  const [loginClicked, setLoginClicked] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [productsInCart, setProductsInCart] = useState<ProductSortedProps[]>([])
  const [userCart, setUserCart] = useState<UserSelectionProps[]>([])
  const [total, setTotal] = useState<number>(0)
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0)
  const [deleteIndex, setDeleteIndex] = useState<number>(0)
  const { isAuthenticated } = useAuth()
  const { user } = useAuth()

  useEffect(() => {
    window.scrollTo(0, 0)

    if (user) {
      getUserProducts('cart', user.id).then(({ userItem, filtered }) => {
        setUserCart(userItem)
        setProductsInCart(filtered)
        setLoading(false)
      })
    } else {
      getCookiesProducts('cart').then(({ cookiesItem, filtered }) => {
        setUserCart(cookiesItem)
        setProductsInCart(filtered)
        setLoading(false)
      })
    }
  }, [user])

  useEffect(() => {
    let total = 0
    let foundZeroQntIndex: number | null = null

    userCart.forEach((el, i) => {
      const quantity = el.qnt ?? 1
      total += quantity * productsInCart[i].price

      if (quantity === 0 && foundZeroQntIndex === null) {
        foundZeroQntIndex = i
      }
    })

    const deliveryCharge = total > 50 ? 0 : 1.49
    setTotal(total)
    setDeliveryCharge(deliveryCharge)

    if (foundZeroQntIndex !== null) {
      setAlertOn(true)
      setDeleteIndex(foundZeroQntIndex)
    }
  }, [userCart])

  return (
    <div className='container px-4 md:px-6 pb-10'>
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
                    <p className='font-semibold'>€ {item.price.toFixed(2)}</p>
                    <div className='text-xs/4 my-2 grid grid-cols-[70px_1fr]'>
                      <p>Color</p><p>{item.color[userCart[i].color]}</p>
                      <p>Size</p><p>{item.size[userCart[i].size]}</p>
                      <p>Quantity</p><p>{userCart[i].qnt === 0 ? 1 : userCart[i].qnt}</p>
                      <p>Total</p>
                      <p className='font-bold'>{userCart[i].qnt === 0 ? item.price.toFixed(2) : (item.price * userCart[i].qnt!).toFixed(2)} €</p>
                    </div>
                    <QuantityInput index={i} max={item.stock[userCart[i].size][userCart[i].color]} userCart={userCart} setUserCart={setUserCart} />
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

        <div className='flex flex-col gap-4 mt-4 md:mt-0'>
          <div>
            {total !== 0 &&
              <div>
                <div className='flex justify-between'>
                  <p>Order value</p>
                  <p className='font-bold'>{total.toFixed(2)} €</p>
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
            }

            <div className='flex justify-between my-4'>
              <p>TOTAL</p>
              <p className='font-bold'>{productsInCart.length > 0 && (total + deliveryCharge).toFixed(2)} €</p>
            </div>
          </div>
          {isAuthenticated ?
            <Button disabled={total === 0}>continue to checkout</Button> :
            <Button onClick={() => setLoginClicked(true)}>log in to checkout</Button>
          }
        </div>
      </div>

      <RecentView />

      {alertOn &&
        <Popup title='Remove Article' setClicked={setAlertOn}>
          <div className='flex flex-col justify-between h-full'>
            <p>Are you sure you want to remove this item from your shopping bag?</p>

            <div className='grid grid-cols-2 gap-4 mt-8'>
              <Button classname='bg-white border border-gray-600' onClick={() => {
                setAlertOn(false)
              }}>cancel</Button>
              <Button onClick={() => {
                setProductsInCart((prev) => prev.filter((_, index) => index !== deleteIndex))
                setUserCart((prev) => prev.filter((_, index) => index !== deleteIndex))
                if (user) deleteUserSelection('cart', user.id, userCart[deleteIndex])
                else removeCookie('cart', userCart[deleteIndex])
                setAlertOn(false)
              }}>remove</Button>
            </div>
          </div>
        </Popup>
      }

      {loginClicked &&
        <LoginPopup setClicked={setLoginClicked} />
      }
    </div>
  )
}

export default Cart