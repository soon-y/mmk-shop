import { useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import type { UserProps } from '../types'
import MyInfo from '../components/user/myInfo'
import MyAddr from '../components/user/myAddr'
import MyBillingAddr from '../components/user/myBillingAddr'
import MyPayment from '../components/user/myPayment'
import { useNavigate } from 'react-router-dom'

function Settings() {
  const { user, logout } = useAuth()
  const [customer, setCustomer] = useState<UserProps>()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) setCustomer(user)
  }, [user])

  const logoutUser = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="p-4 flex flex-col gap-10">
      <h1>Settings</h1>

      {customer &&
        <div className='flex flex-col gap-10'>
          <hr />
          <MyInfo />
          <hr />
          <div>
            <h3>Delievery Address</h3>
            <MyAddr />
          </div>
          <hr />
          <div>
            <h3>Billing Address</h3>
            <MyBillingAddr />
          </div>
          <hr />
          <div>
            <h3>My payment</h3>
            <MyPayment />
          </div>
          <hr />
          <p className='cursor-pointer underline uppercase'>change password</p>
          <hr />
          <p className='cursor-pointer underline uppercase' onClick={logoutUser}>log out</p>
          <hr />
          <div className='text-base mt-10'>
            <span className='uppercase text-gray-500 cursor-pointer hover:underline hover:text-black' onClick={() => navigate('/')}>MMK</span>
            <span className='text-gray-500 mx-2'>/</span>
            <span className='uppercase text-gray-500 cursor-pointer hover:underline hover:text-black' onClick={() => navigate('/account')}>my account</span>
            <span className='text-gray-500 mx-2'>/</span>
            <span className='uppercase font-bold'>Settings</span>
          </div>
        </div>
      }
    </div>
  )
}

export default Settings
