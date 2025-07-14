import { useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import type { UserProps } from '../types'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

function Account() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<UserProps>()

  useEffect(() => {
    if (user) setCustomer(user)
  }, [user])

  const logoutUser = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="container p-4 md:mx-2 grid md:grid-cols-[200px_1fr] gap-4">
      <div className={`flex flex-col justify-between gap-8 ${pathname === '/account' ? '' : 'hidden md:flex'}`}>
        <p className='pt-1'>Welcome <br />
          <span className='font-bold'>{customer?.firstName}</span>
        </p>

        <div className='text-2xl flex flex-col gap-2'>
          <p className={`cursor-pointer ${pathname.includes('/orders') ? 'underline' : ''}`} onClick={() => navigate('/account/orders')}>Orders</p>
          <p className={`cursor-pointer ${pathname.includes('/setting') ? 'underline' : ''}`} onClick={() => navigate('/account/settings')}>Account Seeting</p>
        </div>

        <p className='pt-8 cursor-pointer underline uppercase' onClick={logoutUser}>log out</p>
      </div>

      <div className={`${pathname === '/account' ? 'hidden' : ''}`}>
        <Outlet />
      </div>
    </div>
  )
}

export default Account
