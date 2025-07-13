import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import type { ProductProps } from '../types'
import HeartIcon from '../asset/HeartIcon'
import { fetchProduct, grouppingImgs, grouppingStock } from '../utils/productUtils'
import Button from '../components/ui/button'
import Dropdown from '../components/ui/dropdown'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isTouchDevice, useWindowSize } from '../utils/window'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SimilarProducts from '../components/SimilarProducts'
import { useLocation } from 'react-router-dom'
import { getCookie, saveHistory } from '../utils/cookieUtils'
import SizeSelection from '../components/SizeSelection'
import AddButton from '../components/AddToCartButton'

gsap.registerPlugin(ScrollTrigger)

function ItemDetail() {
  const location = useLocation()
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [product, setProduct] = useState<ProductProps>()
  const [colorID, setColorID] = useState<number>(0)
  const [sizeID, setSizeID] = useState<number | null>(null)
  const [scrollImgIndex, setScrollImgIndex] = useState<number>(0)
  const [imagesByColors, setImagesByColors] = useState<string[][]>([])
  const [stock, setStock] = useState<number[][]>([])
  const [liked, setLiked] = useState<boolean | null>(null)
  const [info, setInfo] = useState<string>('')
  const [id, setID] = useState<number | undefined>()
  const skeletonStyle = 'rounded-md bg-gray-100 animate-pulse text-gray-200'
  const { windowWidth } = useWindowSize()
  const touchDevice = isTouchDevice()

  useEffect(() => {
    const useQuery = () => new URLSearchParams(location.search)
    const query = useQuery()
    const id = query.get('id')
    if (id) setID(Number(id))
    else setID(undefined)

    const color = query.get('color')
    if (color) setColorID(Number(color))
    else setColorID(0)

    document.getElementById('top')?.scrollIntoView()
  }, [location])

  useEffect(() => {
    if (id !== undefined) {
      fetchProduct(id).then((res) => {
        setProduct(res.data)
        setImagesByColors(grouppingImgs(res.data.images, res.data.imagesCount))
        setStock(grouppingStock(res.data.stock))
        setSizeID(res.data.size.split('/').length > 1 ? null : 0)
        setInfo(id.toString() + '/' + colorID)

        saveHistory(id?.toString() + '/' + colorID)

        const favorite = getCookie('favorites')
        if (favorite.includes(id.toString())) setLiked(true)
        setLoading(false)
      })
    }
  }, [id])

  useEffect(() => {
    setInfo(id?.toString() + '/' + colorID)
    const favorite = getCookie('favorites')
    if (favorite.includes(id?.toString() + '/' + colorID)) setLiked(true)
    else setLiked(false)

    if (id) saveHistory(id?.toString() + '/' + colorID)
  }, [colorID])

  useEffect(() => {
    if (windowWidth < 768) setScrollImgIndex(0)
  }, [windowWidth])

  useLayoutEffect(() => {
    const img = imgRef.current
    const desc = descRef.current

    if (!img || !desc) {
      const observer = new MutationObserver(() => {
        if (imgRef.current && descRef.current) {
          observer.disconnect()
          initScrollTrigger()
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })
      return () => observer.disconnect()
    }

    initScrollTrigger()

    function initScrollTrigger() {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }

      if (window.innerWidth >= 768 && !touchDevice && imgRef.current && descRef.current) {
        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: descRef.current,
          start: 'top 165px',
          endTrigger: imgRef.current,
          end: 'bottom bottom',
          pin: descRef.current,
          pinSpacing: false,
          // markers: true,
        })
      }
    }

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
        scrollTriggerRef.current = null
      }
    }
  }, [windowWidth, touchDevice])

  if (!product) return

  return (
    <div className='container md:px-6' id='top'>
      {!loading ?
        product &&
        <div className='grid md:grid-cols-2'>
          <div className={`relative md:overflow-hidden`} ref={imgRef}>
            <div className='relative w-full flex md:block duration-500' style={{ transform: `translateX(calc(100% * ${scrollImgIndex}))` }}>
              {imagesByColors[colorID].map((img, i) => (
                <img key={i} src={img} alt="Product" className='md:rounded-md mb-2' />
              ))}
            </div>
            <HeartIcon className='md:hidden absolute right-2 bottom-5 duration-500 hover:scale-110 cursor-pointer' info={info} active={liked} onClick={() => setLiked(prev => !prev)} />
            <div className='md:hidden absolute flex w-full justify-between p-3 top-[50%] -translate-y-[50%]'>
              {scrollImgIndex !== 0 ?
                <div className='bg-white rounded-full flex items-center justify-center' onClick={() => setScrollImgIndex((i) => (i + 1))}>
                  <ChevronLeft className='w-5 h-5 cursor-pointer text-gray-400' />
                </div> : <div></div>
              }
              {scrollImgIndex !== -imagesByColors[colorID].length + 1 &&
                <div className='bg-white rounded-full flex items-center justify-center' onClick={() => setScrollImgIndex((i) => (i - 1))}>
                  <ChevronRight className='w-5 h-5 cursor-pointer text-gray-400' />
                </div>
              }
            </div>
          </div>

          <div className='w-full'>
            <div className='pb-8 m-auto w-full px-4 py-1 md:pl-8 md:pr-0 lg:w-[80%] flex flex-col gap-6' ref={descRef}>
              <div>
                <div className='flex justify-between md:mt-8'>
                  <p>{product.name}</p>
                  <HeartIcon className='hidden md:block duration-500 hover:scale-110 cursor-pointer' info={info} active={liked} onClick={() => setLiked(prev => !prev)} />
                </div>
                <p className='font-bold'>€ {product.price}</p>
              </div>

              <div className='flex flex-col gap-1 text-sm'>
                <p>COLOR:  {product.color.split('/')[colorID]}</p>
                <div className='flex w-full flex-wrap gap-1'>
                  {imagesByColors.map((img, i) => (
                    <img key={i} onClick={() => setColorID(i)} src={img[0]} alt={product.name + '-' + product.color.split('/')[colorID]}
                      className={`w-20 cursor-pointer md:rounded-sm mb-2 border-2 ${i === colorID ? 'border-black' : 'border-white'}`} />
                  ))}
                </div>
              </div>

              <SizeSelection product={product} colorID={colorID} stock={stock} sizeID={sizeID} setSizeID={setSizeID} />

              <AddButton id={product.id} sizeID={sizeID} colorID={colorID} stock={stock} />

              <Dropdown title='description'>
                {product.description}<br />
                {product.measurement}
              </Dropdown>

              <Dropdown title='material'>
                {product.material}
              </Dropdown>

              <Dropdown title='delivery and payment'>
                {product.description}
              </Dropdown>

            </div>
          </div>
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

      <div className='mt-12'>
        <SimilarProducts category={product.category} productIndex={Number(id)} />
      </div>
    </div>
  )
}

export default ItemDetail