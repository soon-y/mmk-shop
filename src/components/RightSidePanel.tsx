import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function RightSidePanel({ children, clicked, setClicked, groupID, groupName, classname = '' }: {
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
        <div className='flex flex-col items-end'>
          <X className='button mt-4 mr-4' onClick={() => {
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
