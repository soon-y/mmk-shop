import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const Dropdown = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div>
      <div className='cursor-pointer uppercase flex justify-between font-semibold text-gray-400 text-sm' onClick={() => setOpen((prev) => (!prev))}>
        {title}
        {!open ?
          <Plus className='w-4' /> :
          <Minus className='w-4' />
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
