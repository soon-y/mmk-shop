import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function RightSidePanel({ title, children, clicked, setClicked, groupID, groupName, classname = '' }: {
  title?: string,
  children: ReactNode,
  groupID?: number
  groupName?: string
  clicked: boolean,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>,
  classname?: string
}) {

  const navigate = useNavigate()

  return (
    <div className={`relative z-[999] ${classname}`}>
      {clicked && <div className='fixed inset-0 bg-black opacity-70' onClick={() => setClicked(false)}></div>}

      <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-white transform transition-transform duration-500  ${clicked ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex justify-between mt-4'>
          <p className='ml-6 mt-1 uppercase font-semibold'>{title}</p>
          <X className='button mr-4' onClick={() => {
            setClicked(false)
            if (groupID && groupName) navigate(`/shopping/product?group=${(groupName).toLocaleLowerCase()}&id=${groupID}`)
          }} />
        </div>
        <div className='h-[calc(100vh-40px)] overflow-y-auto'>
          {children}
        </div>
      </div>

    </div>
  )
}

export default RightSidePanel
