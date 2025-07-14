import { useEffect, useState } from 'react'
import '../App.css'
import { fetchCategory, getCategoryGroupName } from '../utils/categoryUtils'
import type { BannerProps, CategoryProps, ProductProps } from '../types'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { fetchBanner } from '../utils/bannerUtils'
import { fetchProducts } from '../utils/productUtils'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'


gsap.registerPlugin(ScrollTrigger)

function Home() {
  const [category, setCategory] = useState<CategoryProps[]>([])
  const [products, setProducts] = useState<ProductProps[]>([])
  const [banners, setBanners] = useState<BannerProps[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategory().then((res) => {
      const array: CategoryProps[] = []

      res.forEach((el: CategoryProps) => {
        if (el.groupID === null) array.push(el)
      })

      setCategory(array.sort((a, b) => a.order - b.order))
    })

    fetchProducts().then((res) => {
      setProducts(res)
    })

    fetchBanner().then((res) => {
      setBanners(res)
    })
  }, [])

  const btnLink = (link: string) => {
    let navigate = ''

    category.forEach((el) => {
      if (el.name === link) {
        if (el.groupID === null) navigate = `/shopping/product?group=${el.name}&id=${el.id}`
        else {
          navigate = `/shopping/product?group=${getCategoryGroupName(el.groupID)}?name=${el.name}&id=${el.id}`
        }
      }
    })

    products.forEach((el) => {
      if (el.name === link) navigate = `/products/item?group=${getCategoryGroupName(el.category)}&id=${el.id}&color=0`
    })
    return navigate
  }

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.banner',
          start: 'top 165px',
          end: 'top 155px',
          scrub: true,
          // markers: true,
        }
      })
      tl.from('#header', { backgroundColor: 'transparent' })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div>
      <div className='banner bg-red-500 absolute top-[200px]'></div>
      {/* {banners.map((el, i) => (
        <div key={i} className='w-[100vw] h-[100vh] flex items-center bg-no-repeat bg-cover' style={{ backgroundImage: el.image ? `url(${el.image})` : 'bg-gray-100' }}>
          <div className='p-6 flex flex-col gap-4'>
            <p className='text-4xl'>
              {el.title}
            </p>
            <p className='text-lg'>
              {el.text}
            </p>
            <button className='rounded-full px-4 py-3 rounded mt-12 w-[200px] bg-magenta text-white font-bold text-sm uppercase'
              onClick={() => navigate(btnLink(el.buttonLink))}
            >{el.buttonName}</button>
          </div>
        </div>
      ))} */}



<Swiper
  modules={[Navigation, Pagination, Autoplay]}
  navigation
  pagination={{ clickable: true }}
  autoplay={{ delay: 5000 }}
  loop={true}
  className="w-full h-screen"
>
  {banners.map((el, i) => (
    <SwiperSlide key={i}>
      <div
        className="w-full h-screen flex items-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: el.image ? `url(${el.image})` : undefined,
          backgroundColor: el.image ? undefined : '#f3f4f6', // fallback gray-100
        }}
      >
        <div className="p-6 flex flex-col gap-4">
          <p className="text-4xl text-white drop-shadow-lg">{el.title}</p>
          <p className="text-lg text-white drop-shadow-sm">{el.text}</p>
          <button
            className="rounded-full px-4 py-3 mt-12 w-[200px] bg-magenta text-white font-bold text-sm uppercase"
            onClick={() => navigate(btnLink(el.buttonLink))}
          >
            {el.buttonName}
          </button>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>






      <div>
        {category.map((el, i) => (
          <div key={i}
            className='flex items-center justify-center bg-no-repeat bg-contain bg-bottom m-auto w-full md:w-[500px] h-[30vh] font-bold text-2xl cursor-pointer'
            style={{ backgroundImage: el.image ? `url(${el.image})` : '' }}
            onClick={() => navigate(`/shopping/product?group=${el.name}&id=${el.id}`)}
          >
            <p className='inline-block text-center my-4 px-2 bg-magenta text-white'>{el.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
