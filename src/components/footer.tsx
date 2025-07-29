import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCategory, sortData } from '../utils/categoryUtils'
import type { GroupedCategory } from '../types'
import Dropdown from './ui/dropdown'
import Logo from './ui/logo'
import { FaFacebook, FaInstagram, FaLinkedinIn, FaXing, FaYoutube } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'

function Footer() {
  const [category, setCategory] = useState<GroupedCategory[]>([])
  const navigate = useNavigate()
  const pathname = useLocation().pathname

  useEffect(() => {
    fetchCategory().then((res) => {
      setCategory(sortData(res))
    })
  }, [])

  return (
    <>
      {!pathname.includes('checkout') &&
        <div className='p-4 md:p-6 flex flex-col gap-4'>
          <div className='grid-cols-4 text-sm hidden md:grid'>
            <div>
              <div className='my-2 font-bold'>Shop</div>
              <div className='flex flex-col gap-1 uppercase cursor-pointer'>
                {category.map((el, i) => (
                  <p key={i} className='hover:underline hover:text-magenta'
                    onClick={() => navigate(`/shopping/product?group=${(el.name).toLocaleLowerCase()}&id=${el.id}`)}>
                    {el.name}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <div className='my-2 font-bold'>Our Company</div>
              <div className='flex flex-col gap-1 uppercase cursor-pointer'>
                <p className='hover:underline hover:text-magenta'>About</p>
                <p className='hover:underline hover:text-magenta'>press</p>
                <p className='hover:underline hover:text-magenta'>Imprint</p>
              </div>
            </div>

            <div>
              <div className='my-2 font-bold'>Help</div>
              <div className='flex flex-col gap-1 uppercase cursor-pointer'>
                <p className='hover:underline hover:text-magenta'>customer service</p>
                <p className='hover:underline hover:text-magenta'>my account</p>
                <p className='hover:underline hover:text-magenta'>contact</p>
                <p className='hover:underline hover:text-magenta'>gift cards</p>
                <p className='hover:underline hover:text-magenta'>cookie notice</p>
                <p className='hover:underline hover:text-magenta'>cookie settings</p>
              </div>
            </div>

            <div>
              <div className='my-2 font-bold'>Register Now</div>
              <div className='flex flex-col gap-1'>
                <p>Become a member to receive fantastic offers!</p>
                <p className='cursor-pointer uppercase underline hover:text-magenta'>Register</p>
              </div>
            </div>
          </div>

          <div className='md:hidden flex flex-col gap-4'>
            <Dropdown title='shop'>
              <div className='flex flex-col gap-1 cursor-pointer'>
                {category.map((el, i) => (
                  <div key={i}
                    onClick={() => navigate(`/shopping/product?group=${(el.name).toLocaleLowerCase()}&id=${el.id}`)}>
                    {el.name}
                  </div>
                ))}
              </div>
            </Dropdown>

            <Dropdown title='our company'>
              <p>About</p>
              <p>Press</p>
              <p>Imprint</p>
            </Dropdown>

            <Dropdown title='help'>
              <p>Customer service</p>
              <p>My account</p>
              <p>Contact</p>
              <p>Gift cards</p>
              <p>Cookie notice</p>
              <p>Cookie settings</p>
            </Dropdown>

            <Dropdown title='Register now'>
              <p>Become a member to receive fantastic offers!</p>
              <p className='uppercase underline'>Register</p>

            </Dropdown>
          </div>

          <div>
            <p className='font-semibold'>Germany(€)</p>
          </div>

          <div className='mt-4 flex justify-between items-center inset-0 relative'>
            <Logo classname='grayscale' />
            <div className='flex items-center gap-4 md:gap-6'>
              <FaFacebook />
              <FaYoutube />
              <FaXing />
              <FaInstagram />
              <FaLinkedinIn />
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Footer
