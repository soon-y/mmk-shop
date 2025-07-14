import { useState, useEffect } from 'react'
import Button from '../components/ui/button'
import type { ProductProps } from '../types'
import { getCookieProducts } from '../utils/productUtils'
import ItemBox from '../components/ItemBox'
import QuantityInput from '../components/ui/quantityInput'
import HeartIcon from '../asset/HeartIcon'
import { removeCart, saveFavorite } from '../utils/cookieUtils'
import { useNavigate } from 'react-router-dom'
import { getCategoryGroupName } from '../utils/categoryUtils'
import { CircleQuestionMark } from 'lucide-react'
import Popup from '../components/ui/popup'
import { useAuth } from '../context/auth'

function Cart() {
  const navigate = useNavigate()
  const [alertOn, setAlertOn] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [productsInCart, setProductsInCart] = useState<ProductProps[]>([])
  const [productsInHistory, setProductsInHistory] = useState<ProductProps[]>([])
  const [historyCookie, setHistoryCookie] = useState<string[]>([])
  const [cartCookie, setCartCookie] = useState<string[]>([])
  const [imageCount, setImageCount] = useState<number[][]>([])
  const [quantity, setQuantity] = useState<number[]>([])
  const [price, setPrice] = useState<number[]>([])
  const [stock, setStock] = useState<number[]>([])
  const [total, setTotal] = useState<number>(0)
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0)
  const [deleteIndex, setDeleteIndex] = useState<number>(0)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    document.getElementById('cart')?.scrollIntoView()

    getCookieProducts('history').then(({ cookieName, filtered }) => {
      setHistoryCookie(cookieName)
      setProductsInHistory(filtered)
    })

    getCookieProducts('cart').then(({ cookieName, filtered, stock, imgCountArr }) => {
      setQuantity(Array(cookieName.length).fill(1))
      setCartCookie(cookieName)
      setProductsInCart(filtered)
      setImageCount(imgCountArr)
      setStock(stock)

      const priceArray = filtered.map((el: ProductProps) => el.price)
      setPrice(priceArray)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (quantity.length && price.length) {
      const total = quantity.reduce((acc, qty, i) => acc + qty * price[i], 0)
      const deliveryCharge = total > 30 ? 0 : 1.49
      setDeliveryCharge(deliveryCharge)
      setTotal(total)
    }

    if (quantity.includes(0)) {
      const index = quantity.indexOf(0)
      setAlertOn(true)
      setDeleteIndex(index)
    }
  }, [quantity])

  return (
    <div className='container px-4 md:px-6 pb-10' id='cart'>
      <h1>Cart</h1>
      <div className='gap-4 grid grid-rows md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_400px]'>
        <div className='flex flex-col gap-4'>
          {!loading ?
            productsInCart.length > 0 ?
              productsInCart.map((item, i) => (
                <div className='grid grid-cols-[170px_1fr] gap-4 items-center cursor-pointer' key={i}>
                  <div className='relative'>
                    {imageCount.length > 0 && cartCookie.length > 0 && <img className='rounded-md' src={item.images[imageCount[0][Number(cartCookie[i].split('/')[2])]]}
                      onClick={() => navigate(`/products/item?group=${getCategoryGroupName(item.category)}&id=${item.id}&color=${cartCookie[i].split('/')[2]}`)} />}
                    <HeartIcon className='absolute top-1 right-2' onClick={() => {
                      saveFavorite(item.id + '/' + cartCookie[i].split('/')[2])
                      setProductsInCart((prev) => prev.filter((_, index) => index !== i))
                      setCartCookie((prev) => prev.filter((_, index) => index !== i))
                      setQuantity((prev) => prev.filter((_, index) => index !== i))
                      setPrice((prev) => prev.filter((_, index) => index !== i))
                      removeCart(cartCookie[i])
                    }} />
                  </div>
                  <div>
                    <p>{item.name}</p>
                    <p className='font-semibold'>€ {item.price}</p>
                    <div className='text-xs/4 my-2'>
                      <p className='inline-block w-[70px]'>Color</p>
                      <p className='inline-block'>{item.color.split('/')[Number(cartCookie[i].split('/')[2])]}</p> <br />
                      <p className='inline-block w-[70px]'>Size</p>
                      <p className='inline-block'>{item.size.split('/')[Number(cartCookie[i].split('/')[1])]}</p> <br />
                      <p className='inline-block w-[70px]'>Quantity</p>
                      {quantity && <p className='inline-block'>{quantity[i] === 0 ? 1 : quantity[i]}</p>} <br />
                      <p className='inline-block w-[70px]'>Total</p>
                      {quantity && <p className='inline-block font-semibold'> {quantity[i] === 0 ? item.price : (item.price * quantity[i]).toFixed(2)} €</p>} <br />
                    </div>
                    {quantity && <QuantityInput index={i} max={stock[i]} qnt={quantity} setQnt={setQuantity} />}
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
                  <p className='font-bold'>{total} €</p>
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

            <div className='flex justify-between'>
              <p>TOTAL</p>
              <p className='font-bold'>{total + deliveryCharge} €</p>
            </div>
          </div>
          <Button>continue to checkout</Button>
          {!isAuthenticated &&
            <Button classname='bg-white text-black border border-gray-600'>log in</Button>
          }
        </div>
      </div>

      {productsInHistory.length > 0 &&
        <div>
          <div className='uppercase pt-12 mb-2'>Recently viewed</div>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5'>
            {productsInHistory.slice(0, 12).map((item, i) => (
              <div key={i}>
                <ItemBox product={item} color={Number(historyCookie[i].split('/')[1])} />
              </div>
            ))}
          </div>
        </div>
      }

      {alertOn &&
        <Popup title='Remove Article' setClicked={setAlertOn}>
          <div className='flex flex-col justify-between h-full'>
            <p>Are you sure you want to remove this item from your shopping bag?</p>

            <div className='grid grid-cols-2 gap-4 mt-8'>
              <Button classname='bg-white border border-gray-600' onClick={() => {
                setAlertOn(false)
                setQuantity((prev) => {
                  const array = [...prev]
                  array[deleteIndex] = 1
                  return array
                })
              }}>cancel</Button>
              <Button onClick={() => {
                setProductsInCart((prev) => prev.filter((_, index) => index !== deleteIndex))
                setCartCookie((prev) => prev.filter((_, index) => index !== deleteIndex))
                removeCart(cartCookie[deleteIndex])
                setQuantity((prev) => prev.filter((_, index) => index !== deleteIndex))
                setPrice((prev) => prev.filter((_, index) => index !== deleteIndex))
                setAlertOn(false)
              }}>remove</Button>
            </div>
          </div>
        </Popup>
      }
    </div>
  )
}

export default Cart