import React, { type ReactNode } from 'react'
import { useWindowSize } from '../../utils/window'
import { X } from 'lucide-react'

function Popup({ children, title, setClicked }: {
  children: ReactNode
  title: string
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { windowWidth } = useWindowSize()

  return (
    <div className='fixed inset-0 w-[100vw] h-[100vh] z-[999]'>
      <div className='bg-black/70 w-full h-full flex items-center justify-center'>
        <div className={`overflow-y-auto bg-white p-6 ${windowWidth <= 350 ? 'w-full h-full' : 'w-[350px]'}`}>
          <div className='flex justify-between'>
            <p className='font-bold uppercase mb-2'>{title}</p>
            <X className='cursor-pointer' onClick={() => setClicked(false)} />
          </div>
          <div className={` ${windowWidth <= 350 ? 'h-[calc(100vh-80px)]' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup