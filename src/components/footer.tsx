import { useEffect, useState } from 'react'
import { User, ShoppingBag, Menu, X, Facebook } from 'lucide-react'
import Searchbar from './Searchbar'
import Navigation from './Navigation'
import { useNavigate } from 'react-router-dom'
import { fetchCategory, sortData } from '../utils/categoryUtils'
import type { GroupedCategory } from '../types'
import Dropdown from './ui/dropdown'
import Logo from './ui/logo'
import { FaFacebook, FaInstagram, FaLinkedinIn, FaTwitter, FaXing, FaYoutube } from 'react-icons/fa'


function Footer() {
  const [category, setCategory] = useState<GroupedCategory[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategory().then((res) => {
      setCategory(sortData(res))
    })
  }, [])



  return (
    <div className='p-4 md:p-6 flex flex-col gap-4'>
      <div className='grid-cols-4 text-sm hidden md:grid'>
        <div>
          <div className='my-2 font-bold'>Shop</div>
          <div className='flex flex-col gap-1 uppercase cursor-pointer'>
            {category.map((el, i) => (
              <div key={i}
                onClick={() => navigate(`/shopping/product?group=${(el.name).toLocaleLowerCase()}&id=${el.id}`)}>
                {el.name}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className='my-2 font-bold'>Our Company</div>
          <div className='flex flex-col gap-1 uppercase cursor-pointer'>
            <p>About</p>
            <p>press</p>
            <p>Imprint</p>
          </div>
        </div>

        <div>
          <div className='my-2 font-bold'>Help</div>
          <div className='flex flex-col gap-1 uppercase cursor-pointer'>
            <p>customer service</p>
            <p>my account</p>
            <p>contact</p>
            <p>gift cards</p>
            <p>cookie notice</p>
            <p>cookie settings</p>
          </div>
        </div>

        <div>
          <div className='my-2 font-bold'>Register Now</div>
          <div className='flex flex-col gap-1'>
            <p>Become a member to receive fantastic offers!</p>
            <p className='uppercase underline'>Register</p>
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
  )
}

export default Footer
