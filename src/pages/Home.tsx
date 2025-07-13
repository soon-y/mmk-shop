import { useEffect, useState } from 'react'
import '../App.css'
import { fetchCategory } from '../utils/categoryUtils'
import type { CategoryProps } from '../types'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

function Home() {
  const [category, setCategory] = useState<CategoryProps[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategory().then((res) => {
      const array: CategoryProps[] = []

      res.forEach((el: CategoryProps) => {
        if (el.groupID === null) array.push(el)
      })

      setCategory(array.sort((a, b) => a.order - b.order))
    })
  }, [])

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
      <div className='w-[100vw] h-[100vh] flex items-center bg-gray-100'>
        <div className='p-6 flex flex-col gap-4'>
          <p className='text-4xl banner'>
            Museum-inspired goods — clothing, bags, stationery, and more
          </p>
          <button className='rounded-full px-4 py-3 rounded mt-12 w-[200px] bg-magenta text-white font-bold text-sm'>SHOP NOW</button>
        </div>
      </div>
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
