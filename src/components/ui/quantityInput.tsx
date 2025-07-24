import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { updateCookieQnt } from '../../utils/cookiesUtils'
import type { UserSelectionProps } from '../../types'
import { useAuth } from '../../context/auth'
import { updateCartQnt } from '../../utils/userUtils'

function QuantityInput({ index, max, userCart, setUserCart }: {
  index: number,
  max: number,
  userCart: UserSelectionProps[],
  setUserCart: React.Dispatch<React.SetStateAction<UserSelectionProps[]>>
}) {
  const [value, setValue] = useState(userCart[index].qnt)
  const { user } = useAuth()

  const decrease = () => {
    if (value! > 0) setValue(prev => {
      if (user) updateCartQnt(user.id, index, prev! - 1)
      else updateCookieQnt('cart', index, prev! - 1)
      return prev! - 1
    })
  }

  const increase = () => {
    if (value! < max) setValue(prev => {
      if (user) updateCartQnt(user.id, index, prev! + 1)
      else updateCookieQnt('cart', index, prev! + 1)
      return prev! + 1
    })
  }

  useEffect(() => {
    setUserCart((prev) => {
      const updated = [...prev]
      updated[index].qnt = value
      return updated
    })
  }, [value])

  return (
    <div className="flex items-center justify-between gap-1 w-[100px] select-none">
      <div className='border rounded-full cursor-pointer border p-1'>
        <Minus onClick={decrease} className='w-4 h-4' />
      </div>
      <div className="flex items-center bg-blue-500">
        {value === 0 ? 1 : value}
      </div>
      <div className='border rounded-full cursor-pointer border p-1'>
        <Plus onClick={increase} className='w-4 h-4' />
      </div>
    </div>
  )
}

export default QuantityInput
