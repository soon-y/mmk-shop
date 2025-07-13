import { useState, type ReactNode } from 'react'
import { XCircle } from 'lucide-react'


function Input({ type, placeholder, children, xmark, setInputVal }: {
  type?: string,
  placeholder: string,
  children: ReactNode,
  xmark?: boolean,
  setInputVal: React.Dispatch<React.SetStateAction<string>>
}) {
  const [value, setValue] = useState('')

  return (
    <div className='rounded-full p-2 bg-white w-full flex border'>
      {children}
      <input
        type={type ? 'text' : type}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setInputVal(e.target.value)
        }}
        className="w-full outline-none"
        placeholder={placeholder}
      />
      {xmark 
      && <XCircle className='cursor-pointer mx-1' strokeWidth={1} onClick={() => {
        setValue('')
        setInputVal('')
      }} />}
    </div>
  )
}

export default Input
