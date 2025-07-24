import { useEffect, useState } from 'react'
import '../App.css'
import { fetchCategory } from '../utils/categoryUtils'
import type { CategoryProps } from '../types'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Banner from '../components/banner'

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
      tl.from('#header', { backgroundColor: 'rgba(255,255,255,0.1)' })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div>
      <Banner />
      <div className='banner bg-red-500 absolute top-[200px]'></div>
      <div>
        {category.map((el, i) => (
          <div
            key={i}
            className="group duration-500 flex items-center justify-center bg-no-repeat bg-contain bg-bottom m-auto w-full md:w-[500px] h-[30vh] font-bold text-2xl cursor-pointer md:grayscale hover:grayscale-0 transition-all"
            style={{ backgroundImage: el.image ? `url(${el.image})` : '' }}
            onClick={() => navigate(`/shopping/product?group=${el.name}&id=${el.id}`)}
          >
            <p className="inline-block text-center my-4 px-2 text-black bg-white/70 rounded group-hover:bg-magenta group-hover:text-white">
              {el.name}
            </p>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Home
