import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { updateCart } from '../../utils/cookieUtils'

function QuantityInput({ index, max, qnt, setQnt, setCartCookie }: {
  index: number,
  max: number,
  qnt: number[],
  setQnt: React.Dispatch<React.SetStateAction<number[]>>
  setCartCookie: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const [value, setValue] = useState(qnt[index])

  const decrease = () => {
    if (value > 0) setValue(prev => prev - 1)
  }

  const increase = () => {
    if (value < max) setValue(prev => prev + 1)
  }

  useEffect(() => {
    setQnt((prev) => {
      const array = [...prev]
      array[index] = value
      return array
    })
  }, [value])

  useEffect(() => {
    setValue(qnt[index])
    
    setCartCookie(prev => {
      const updated = [...prev]
      const [idPart] = prev[index].split('-')
      updated[index] = `${idPart}-${qnt[index]}`
      updateCart(updated[index])

      return updated
    })
  }, [qnt])

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
