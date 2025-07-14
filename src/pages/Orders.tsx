import { useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import type { UserProps } from '../types'
import { Outlet } from 'react-router-dom'


function Orders() {
  const { user, setUser } = useAuth()
  const [orders, setOrders] = useState<UserProps>()


  useEffect(() => {

  }, [user])

  return (
    <div className="">
      <h1>My purchases</h1>
        

    </div>
  )
}

export default Orders
