import { useEffect, useState } from 'react'
import type { ProductSortedProps } from '../types'
import HeartIcon from '../asset/HeartIcon'
import { fetchProductAndSortData } from '../utils/productUtils'
import Button from '../components/ui/button'
import Dropdown from '../components/ui/dropdown'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useWindowSize } from '../utils/window'
import SimilarProducts from '../components/SimilarProducts'
import { useLocation } from 'react-router-dom'
import { saveHistory } from '../utils/cookiesUtils'
import SizeSelection from '../components/SizeSelection'
import AddToCartButton from '../components/AddToCartButton'
import { useAuth } from '../context/auth'
import AddToCartBox from '../components/box/AddToCartBox'

function ItemDetail() {
  const location = useLocation()
  const [loading, setLoading] = useState<boolean>(true)
  const [product, setProduct] = useState<ProductSortedProps | null>()
  const [colorIndex, setColorIndex] = useState<number>(0)
  const [sizeIndex, setSizeIndex] = useState<number | null>(null)
  const [scrollImgIndex, setScrollImgIndex] = useState<number>(0)
  const [favInfo, setFavInfo] = useState<{ id: number, size: number, color: number }>({ id: 0, size: 0, color: 0 })
  const [id, setID] = useState<number | undefined>()
  const skeletonStyle = 'rounded-md bg-gray-100 animate-pulse text-gray-200'
  const { windowWidth } = useWindowSize()
  const { user } = useAuth()
  const [addtoCart, setAddtoCart] = useState<boolean>(false)

  useEffect(() => {
    const useQuery = () => new URLSearchParams(location.search)
    const query = useQuery()
    const id = query.get('id')
    if (id) setID(Number(id))
    else setID(undefined)

    const color = query.get('color')
    if (color) setColorIndex(Number(color))
    else setColorIndex(0)

    window.scrollTo(0, 0)
  }, [location])

  useEffect(() => {
    if (id !== undefined) {
      fetchProductAndSortData(id).then((res) => {
        if (res !== null) {
          setProduct(res)
          setSizeIndex(res.size.length > 1 ? null : 0)
          setFavInfo({ id: res.id, size: 0, color: colorIndex })
          saveHistory({ id: res.id, size: 0, color: colorIndex })
        }
        setLoading(false)
      })
    }
  }, [id, user])

  useEffect(() => {
    if (id) {
      setFavInfo({ id: id, size: 0, color: colorIndex })
      saveHistory({ id: id, size: 0, color: colorIndex })
    }
  }, [colorIndex])

  useEffect(() => {
    if (windowWidth < 768) setScrollImgIndex(0)
  }, [windowWidth])

  if (!product) return

  return (
    <div className='container md:px-6' id='top'>
      {!loading ?
        product &&
        <div className='grid md:grid-cols-2 '>
          <div className={`relative`}>
            <div className='relative w-full flex md:block duration-500' style={{ transform: `translateX(calc(100% * ${scrollImgIndex}))` }}>
              {product.images[colorIndex].map((img, i) => (
                <img key={i} src={img} alt="Product" className='md:rounded-md mb-2' />
              ))}
            </div>
            <HeartIcon classname='md:hidden absolute right-2 bottom-5' info={favInfo} />
            {product.discount !== product.price &&
              <p className='font-bold absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-md text-white'>
                {Math.round((product.price - product.discount) / product.price * 100)}%
              </p>
            }
            <div className='md:hidden absolute flex w-full justify-between top-[50%] -translate-y-[50%]'>
              {scrollImgIndex !== 0 ?
                <ChevronLeft className='mix-blend-difference p-2 w-10 h-10 cursor-pointer text-black' onClick={() => setScrollImgIndex((i) => (i + 1))} />
                : <div></div>
              }
              {scrollImgIndex !== -product.images[colorIndex].length + 1 &&
                <ChevronRight className='mix-blend-difference p-2 w-10 h-10 cursor-pointer text-black' onClick={() => setScrollImgIndex((i) => (i - 1))} />
              }
            </div>
          </div>

          <div className="self-start sticky top-[160px] h-fit">
            <div className='m-auto w-full px-4 py-1 md:pl-8 md:pr-0 lg:w-[80%] flex flex-col gap-6'>
              <div>
                <div className='flex justify-between md:mt-8'>
                  <p>{product.name}</p>
                  <HeartIcon classname='hidden md:block' info={favInfo} />
                </div>
                <div className='flex gap-2'>
                  <p className='font-bold'>€ {product.discount.toFixed(2)}</p>
                  {product.discount !== product.price && <p className='text-gray-400 font-bold line-through'>€ {product.price.toFixed(2)}</p>}
                </div>
              </div>

              <div className='flex flex-col gap-1 text-sm'>
                <p>COLOR:  {product.color[colorIndex]}</p>
                <div className='flex w-full flex-wrap gap-1'>
                  {product.images.map((img, i) => (
                    <img key={i} onClick={() => setColorIndex(i)} src={img[0]} alt={product.name + '-' + product.color[colorIndex]}
                      className={`w-20 cursor-pointer md:rounded-sm mb-2 border-2 ${i === colorIndex ? 'border-black' : 'border-white'}`} />
                  ))}
                </div>
              </div>

              <SizeSelection product={product} colorIndex={colorIndex} sizeIndex={sizeIndex} setSizeIndex={setSizeIndex} />

              <AddToCartButton product={product} sizeIndex={sizeIndex} colorIndex={colorIndex} setAddtoCart={setAddtoCart} />

              <Dropdown title='description'>
                <p className="whitespace-pre-line">
                  {product.description}<br />
                  {product.measurement}
                </p>
              </Dropdown>

              <Dropdown title='material'>
                <p className="whitespace-pre-line">
                  {product.material}
                </p>
              </Dropdown>

              <Dropdown title='delivery and payment'>
                <p>
                  Orders are typically processed within 1-2 business days and delivered within 3-5 business days.
                  Tracking information will be provided via email once your order has been shipped.
                </p>
                <ul>
                  <li>
                    Standard Shipping: Free for orders over €50
                  </li>
                  <li>
                    International Shipping: Available, fees vary by destination
                  </li>
                  Please ensure your shipping details are correct at checkout to avoid delays.
                </ul>

                <br />
                <p>
                  Payment Methods
                  We accept the following secure payment options:
                </p>
                <ul>
                  <li>
                    Credit/Debit Cards (Visa, MasterCard)
                  </li>
                  <li>
                    PayPal
                  </li>
                  <li>
                    Apple Pay / Google Pay
                  </li>
                  <li>
                    Bank Transfer (selected regions only)
                  </li>
                </ul>
                <p>
                  All transactions are encrypted and protected. You will receive a confirmation email once your payment is successfully processed.
                  For any questions about payment or shipping, feel free to contact our support team.
                </p>
              </Dropdown>
            </div>
          </div>

          <AddToCartBox product={product} sizeIndex={sizeIndex} colorIndex={colorIndex} addtoCart={addtoCart} />
        </div>
        :
        <div className='grid md:grid-cols-2'>
          <div className={`flex md:block aspect-square ${skeletonStyle}`}></div>

          <div className='flex justify-center'>
            <div className='w-full px-4 py-1 md:pl-8 md:pr-0 lg:w-[80%] flex flex-col gap-6'>
              <div>
                <div className='flex justify-between items-center md:mt-8'>
                  <p className={`w-16 h-5 my-1 ${skeletonStyle}`}></p>
                </div>
                <p className={`w-10 h-5 ${skeletonStyle}`}></p>
              </div>

              <div>
                <div className='text-gray-200 flex items-center gap-2 mb-1'>COLOR</div>
                <div className='flex w-full flex-wrap gap-1'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`w-20 aspect-square ${skeletonStyle}`}></div>
                  ))}
                </div>
              </div>

              <div>
                <p className='text-gray-200 mb-1'>Choose Size</p>
                <div className={`w-full h-10 ${skeletonStyle}`}></div>
              </div>

              <div className='flex flex-col items-center'>
                <Button disabled={true}>Add</Button>
              </div>

              <Dropdown title='description'>
                <div className={`w-full h-8 rounded-md ${skeletonStyle}`}></div>
              </Dropdown>

              <Dropdown title='material'>
                <div className={`w-full h-8 rounded-md ${skeletonStyle}`}></div>
              </Dropdown>

              <Dropdown title='delivery and payment'>
                <div className={`w-full h-8 rounded-md ${skeletonStyle}`}></div>
              </Dropdown>
            </div>
          </div>
        </div>
      }

      <div className='mt-0 md: mt-12 relative'>
        <SimilarProducts category={product.category} productIndex={Number(id)} />
      </div>
    </div>
  )
}

export default ItemDetail