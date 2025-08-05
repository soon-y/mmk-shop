import { useEffect, useState } from 'react'
import '../App.css'
import { fetchCategory, getCategoryGroupName } from '../utils/categoryUtils'
import type { BannerProps, CategoryProps, ProductProps } from '../types'
import { useNavigate } from 'react-router-dom'
import { fetchBanner, sortBanner } from '../utils/bannerUtils'
import { fetchProducts } from '../utils/productUtils'
import { Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'


function Banner() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<CategoryProps[]>([])
  const [products, setProducts] = useState<ProductProps[]>([])
  const [banners, setBanners] = useState<BannerProps[]>([])

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
      setBanners(sortBanner(res))
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

  return (
    <div>
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        loop={banners.length > 2}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        className="w-full h-screen"
      >
        {banners.map((el, i) => (
          <SwiperSlide key={i}>
            <div
              className="w-[100vw] h-[100vh] flex md:items-center bg-no-repeat bg-cover bg-center"
              style={{
                backgroundImage: el.image ? `url(${el.image})` : 'none',
                backgroundColor: el.image ? undefined : '#f3f3f3',
              }}
            >
              <div className="flex flex-col gap-4 p-6 md:bg-transparent mt-[90px] md:mt-0">
                <p className="font-bold text-4xl text-white whitespace-pre-line md:whitespace-normal">
                  {el.title}
                </p>
                <p className="text-lg text-white lg:w-[30%] md:w-[50%]">
                  {el.text}
                </p>
                {el.buttonLink && el.buttonName && (
                  <button
                    className="rounded-full px-4 py-3 mt-12 w-[200px] bg-[rgba(255,255,255,0.3)] text-white font-bold text-sm uppercase"
                    onClick={() => navigate(btnLink(el.buttonLink))}
                  >
                    {el.buttonName}
                  </button>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Banner
