import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const Dropdown = ({ title, children, classname }: { title: string, children: React.ReactNode, classname?: string }) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div>
      <div className={`cursor-pointer uppercase flex justify-between font-semibold ${classname ? classname : 'text-gray-500 text-sm' }`} onClick={() => setOpen((prev) => (!prev))}>
        {title}
        {!open ?
          <Plus className='w-5 text-gray-500 hover:text-black' /> :
          <Minus className='w-5 text-gray-500 hover:text-black' />
        }
      </div>

      {open &&
        <div className='text-sm'>
          {children}
        </div>
      }
    </div>
  )
}

export default Dropdown
