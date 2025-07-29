import { Minus, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Popup from '../../components/ui/popup'
import { useCart } from '../../context/cart'
import Button from './button'

function QuantityInput({ index, max }: {
  index: number,
  max: number,
}) {
  const [value, setValue] = useState<number | null>(null)
  const { refreshCart, userSelection, updateQnt, deleteProduct } = useCart()
  const [alertOn, setAlertOn] = useState<boolean>(false)
  const [deleteIndex, setDeleteIndex] = useState<number>(0)

  useEffect(() => {
    if (userSelection[index]) {
      setValue(userSelection[index].qnt!)
    }
  }, [userSelection])

  const decrease = () => {
    if (value! > 0) setValue(prev => {
      updateQnt(index, prev! - 1)
      return prev! - 1
    })
  }

  const increase = () => {
    if (value! < max) setValue(prev => {
      updateQnt(index, prev! + 1)
      return prev! + 1
    })
  }

  useEffect(() => {
    if (value === 0) {
      console.log('alert on: ' + index)
      setDeleteIndex(index)
      setAlertOn(true)
    }

    setTimeout(() => {
      refreshCart()
    }, 500)

  }, [value])

  return (
    <>
      <div className="flex items-center justify-between gap-1 w-[100px] select-none">
        <div className='border rounded-full cursor-pointer border p-1' onClick={decrease}>
          {value! < 2 ?
            <Trash2 className='w-4 h-4' /> :
            <Minus className='w-4 h-4' />
          }
        </div>
        <div className="flex items-center bg-blue-500">
          {value === 0 ? 1 : value}
        </div>
        <div className='border rounded-full cursor-pointer border p-1' onClick={increase} >
          <Plus className='w-4 h-4' />
        </div>
      </div>

      {alertOn &&
        <Popup title='Remove Article' setClicked={setAlertOn}>
          <div className='flex flex-col justify-between h-full'>
            <p>Are you sure you want to remove this item from your shopping bag?</p>

            <div className='grid grid-cols-2 gap-4 mt-8'>
              <Button classname='bg-white border border-gray-600' onClick={() => {
                setAlertOn(false)
                updateQnt(deleteIndex, 1)
              }}>cancel</Button>
              <Button onClick={() => {
                deleteProduct(deleteIndex)
                setAlertOn(false)
              }}>remove</Button>
            </div>
          </div>
        </Popup>
      }

    </>
  )
}

export default QuantityInput
