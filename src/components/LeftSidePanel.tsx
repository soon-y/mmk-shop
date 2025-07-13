import { type ReactNode } from 'react'
import Navigation from './Navigation'

function LeftSidePanel({ children, width }: { children: ReactNode, width: number | null }) {

  return (
    <div className='hidden md:block fixed'>
      <div className="fixed inset-0 bg-black opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-40" />
      <div className={`fixed inset-0 bg-white h-full transform transition-transform duration-500 group-hover:translate-x-0 -translate-x-full`} style={{
        width: width ?? 0
      }}>
        <Navigation classname='opacity-0 mt-[86px] p-6' />
        <div className='w-[25%] h-[1px] bg-blue mx-6'></div>
        <div className='overflow-y-scroll h-[calc(100vh-397px)] '>
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSidePanel
