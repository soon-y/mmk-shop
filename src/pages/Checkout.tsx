import { useState, useEffect, useRef } from 'react'
import Button from '../components/ui/button'
import type { UserSelectionProps, ProductSortedProps } from '../types'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, LockKeyhole, Loader2 } from 'lucide-react'
import OrderValue from '../components/cart/orderValue'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import MyInfo from '../components/user/myInfo'
import MyAddr from '../components/user/myAddr'
import MyBillingAddr from '../components/user/myBillingAddr'
import MyPayment from '../components/user/myPayment'
import RightSidePanel from '../components/RightSidePanel'
import { addOrder } from '../utils/userUtils'

function Checkout() {
  const navigate = useNavigate()
  const [productsInCart, setProductsInCart] = useState<ProductSortedProps[]>([])
  const [userCart, setUserCart] = useState<UserSelectionProps[]>([])
  const [openPackage, setOpenPackage] = useState<boolean>(false)
  const { products, userSelection, loading, deleteProduct, totalQnt, dropCart } = useCart()
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0)
  const [totalAmount, setTotal] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const { user, addr, billingAddr } = useAuth()
  const [addrIndex, setAddrIndex] = useState<number>(-1)
  const [billingAddrIndex, setBillingAddrIndex] = useState<number>(-1)
  const [waiting, setWaiting] = useState<boolean>(false)
  const [openShippingInfo, setOpenShippingInfo] = useState<boolean>(false)
  const packageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProductsInCart(products)
    setUserCart(userSelection)
    packageRef.current?.scrollIntoView({ behavior: 'smooth' })
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

  useEffect(() => {
    if (totalQnt === 0) navigate('/cart')
  }, [totalQnt])

  useEffect(() => {
    if (addr) {
      setAddrIndex(addr?.findIndex((el) => el.select === true))
    }
  }, [addr])

  useEffect(() => {
    if (billingAddr) setBillingAddrIndex(billingAddr?.findIndex((el) => el.select === true))
  }, [billingAddr])

  return (
    <div>
      <div className='p-4 md:p-6'>
        <p className='mb-4 cursor-pointer underline flex hover:text-magenta' onClick={() => navigate('/cart')}>
          <ArrowLeft className='button' /> Back to cart
        </p>
        <h1>Checkout</h1>
        <div className='gap-8 grid grid-rows md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_400px]'>
          <div className='flex flex-col gap-4'>
            <div>
              <h3>My information</h3>
              <MyInfo />
            </div>

            <hr />

            <div>
              <h3>billing address</h3>
              <MyBillingAddr />
            </div>

            <hr />

            <div>
              <h3>delivery address</h3>
              <MyAddr />
            </div>

            <hr />

            <div ref={packageRef}>
              <h3>Package</h3>
              <p>Shipped by MMK</p>
              <p id='package' className='uppercase py-2 underline cursor-pointer' onClick={() => setOpenPackage(true)}>{totalQnt > 1 ? totalQnt + ' articles' : '1 article'}</p>
              {!loading ?
                <div className='w-full grid grid-cols-4 gap-2 items-center'>
                  {productsInCart.map((item, i) => (
                    <div className='relative' key={i}>
                      <img className='rounded-md' src={item.images[userCart[i].color][0]} />
                      <Trash2 className='absolute bottom-0 right-0 bg-white/80 p-2 w-10 h-10 cursor-pointer' onClick={() => {
                        deleteProduct(i)
                      }} />
                    </div>
                  ))}
                </div>
                :
                <div className='w-full grid grid-cols-4 gap-2 items-center'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='w-full aspect-square rounded-md bg-gray-100'></div>
                  ))}
                </div>
              }

              <p className='mt-8 font-bold'>Standard delivery. Free for orders over €50</p>
              <p>{deliveryCharge === 0 ? 'For free. 2-4 working days' : '€' + deliveryCharge}</p>
            </div>

            <hr />

            <div>
              <h3>checkout payment</h3>
              <MyPayment />
            </div>
          </div>

          <div className='flex flex-col gap-4 mt-4 md:mt-0 sticky top-6 self-start'>
            <OrderValue />
            <p className='text-sm'>We process your personal data in accordance with <span className='underline'>MMK's privacy policy</span>.</p>
            <p className='text-sm mb-4'>By continuing, you agree to  <span className='underline'>MMK's Terms and Conditions</span>.</p>
            <Button disabled={
              !user || !addr || !billingAddr || addrIndex === -1 || billingAddrIndex === -1
              || !user?.contact || !user.payment
              || !addr[addrIndex].contact || !billingAddr[billingAddrIndex].contact
              || !addr[addrIndex].street || !billingAddr[billingAddrIndex].street
            } onClick={() => {
              setWaiting(true)

              addOrder({
                userId: user!.id,
                status: 'ordered',
                totalAmount: totalAmount,
                discount: discount,
                shippingFee: deliveryCharge,
                paidAmount: totalAmount - discount + deliveryCharge,
                paymentMethod: user!.payment!,
                paymentStatus: 'approved',
                transactionId: '',
                shippingAddr: addr![addrIndex].street + ' ' + addr![addrIndex].postalCode + ' ' + addr![addrIndex].city + ' ' + addr![addrIndex].country,
                billingAddr: billingAddr![billingAddrIndex].street + ' ' + billingAddr![billingAddrIndex].postalCode + ' ' + billingAddr![billingAddrIndex].city + ' ' + billingAddr![billingAddrIndex].country,
                shippingName: addr![addrIndex].firstName + ' ' + addr![addrIndex].lastName,
                billingName: billingAddr![billingAddrIndex].firstName + ' ' + billingAddr![billingAddrIndex].lastName,
                shippingContact: addr![addrIndex].contact,
                billingContact: billingAddr![billingAddrIndex].contact,
              },
                userSelection.map((el, i) => ({
                  userId: user!.id,
                  productId: el.id!,
                  size: products[i].size[el.size],
                  color: products[i].color[el.color],
                  quantity: el.qnt!,
                  total: Number(el.qnt!) * Number(products[i].price)
                })))

              setTimeout(() => {
                dropCart()
                navigate('/order-confirm')
                setWaiting(false)
              }, 3000)
            }
            }>{waiting ?
              <Loader2 className='w-5 h-5 animate-spin' /> :
              'complete purchase'
              }</Button>
            <p className='text-sm mt-4 flex items-center'>
              <LockKeyhole className='w-4 mr-2' />
              All data is stored securely. Payment details are encrypted.
            </p>
            <p className='text-sm'>Do you need help? Please contact <span className='underline cursor-pointer' onClick={() => navigate('/customer-service')}>customer service</span>.</p>
            <p className='uppercase underline mt-4 cursor-pointer' onClick={() => setOpenShippingInfo(true)}>Shipping and return options</p>
          </div>
        </div>
      </div >

      <RightSidePanel clicked={openPackage} setClicked={setOpenPackage} title='view oerder details'>
        {openPackage &&
          <div className='p-6 flex flex-col gap-4'>
            <div>
              <p className=''>Package</p>
              <p className=''>Shipped by MMK</p>
            </div>

            {productsInCart && productsInCart.map((item, i) => (
              <div className='grid grid-cols-[180px_1fr] gap-4' key={i}>
                <div className='relative'>
                  <img className='rounded-md' src={item.images[userCart[i].color][0]} />
                  <Trash2 className='absolute bottom-0 right-0 bg-white/80 p-2 w-10 h-10 cursor-pointer' onClick={() => {
                    deleteProduct(i)
                  }} />
                </div>

                <div className='h-full flex flex-col gap-1 text-sm'>
                  <p>{item.name}</p>
                  <p className='font-bold'>€ {item.price}</p>
                  <div>
                    <p className="flex gap-1 mt-4">
                      Size: <span>{item.size[userSelection[i].size]}</span>
                    </p>
                    <p className="flex gap-1">
                      Color: <span>{item.color[userSelection[i].color]}</span>
                    </p>
                    <p className="flex gap-1">
                      Quantity: <span>{userSelection[i].qnt}</span>
                    </p>
                    <p className="flex gap-1">
                      Total: <span className='font-bold'>€ {Number(userSelection[i].qnt) * item.price}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>}
      </RightSidePanel>

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

export default Checkout