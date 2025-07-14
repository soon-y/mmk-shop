import { useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import type { UserProps } from '../types'


function Settings() {
  const { user } = useAuth()
  const [customer, setCustomer] = useState<UserProps>()

  useEffect(() => {
    if (user) setCustomer(user)
  }, [user])


  return (
    <div className="">
      <h1>Settings</h1>

      {customer &&
        <div className='flex flex-col gap-4'>
          <div>
            <p>{customer.email}</p>
            <p>{customer.firstName} {customer.lastName}</p>
          </div>
          <div>
            address
            {customer.address === '' ? 
            <div>add address</div> :
            <div>
              {customer.address}
            </div>
            }
          </div>
        </div>
      }
    </div>
  )
}

export default Settings
