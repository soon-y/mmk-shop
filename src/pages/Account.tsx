import { useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import type { UserProps } from '../types'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useWindowSize } from '../utils/window'

function Account() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<UserProps>()
  const { windowWidth } = useWindowSize()

  useEffect(() => {
    if (user) setCustomer(user)
  }, [user])

  const logoutUser = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="container grid md:grid-cols-[260px_1fr] gap-4">
      <div className={`grayscale bg-no-repeat bg-cover bg-center self-start sticky top-[160px] h-[calc(100vh-90px)] md:h-[calc(100vh-160px)] p-4 flex flex-col justify-between gap-8 ${pathname === '/account' ? '' : 'hidden md:flex'}`}
        style={{ backgroundImage: `url('${windowWidth < 768 ? 'https://qfoncqojmqdoqxleuioe.supabase.co/storage/v1/object/public/banner-img/account_Img.jpg' : ''}')` }}>
        <p className='pt-1'>Welcome <br />
          <span className='font-bold'>{customer?.firstName}</span>
        </p>

        <div className='text-2xl flex flex-col gap-1 mix-blend-difference text-white md:mix-blend-normal md:text-black'>
          <p className={`hover:text-magenta hover:underline cursor-pointer ${pathname.includes('/orders') ? 'underline text-magenta' : ''}`} onClick={() => navigate('/account/orders')}>Orders</p>
          <p className={`hover:text-magenta hover:underline cursor-pointer ${pathname.includes('/setting') ? 'underline text-magenta' : ''}`} onClick={() => navigate('/account/settings')}>Account Setting</p>
        </div>

        <p className='pt-8 cursor-pointer underline uppercase' onClick={logoutUser}>log out</p>
      </div>

      {pathname === '/account' ?
        <div className="hidden md:grid place-items-center bg-no-repeat bg-cover bg-center m-auto w-full h-full orgin-center grayscale"
          style={{ backgroundImage: `url('https://qfoncqojmqdoqxleuioe.supabase.co/storage/v1/object/public/banner-img//account_Img.jpg')` }}>
          <h1 className='mix-blend-exclusion text-white'>We are all connected.</h1>
        </div> :
        <div>
          <Outlet />
        </div>}
    </div>
  )
}

export default Account
