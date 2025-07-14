import { useState, type ReactNode } from 'react'
import { XCircle } from 'lucide-react'


function Input({ type, placeholder, children, xmark, setInputVal, disabled, readOnly, initial }: {
  initial?: string,
  type?: string,
  placeholder?: string,
  children: ReactNode,
  xmark?: boolean,
  disabled?: boolean,
  readOnly?: boolean,
  setInputVal: React.Dispatch<React.SetStateAction<string>>
}) {
  const [value, setValue] = useState(initial ? initial : '')

  return (
    <div className='relative rounded-full bg-white w-full flex border border-gray-300 overflow-hidden'>
      <div className='absolute mx-1 my-[10px]'>{children}</div>
      <input
        readOnly={readOnly}
        disabled={disabled}
        type={type ? type : 'text'}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setInputVal(e.target.value)
        }}
        className={`w-full h-full outline-none py-3 pl-10 ${readOnly ? 'text-gray-500 cursor-not-allowed bg-gray-100' : ''}`}
        placeholder={placeholder}
      />
      {xmark
        && <XCircle className='cursor-pointer my-[10px] mx-4' strokeWidth={1} onClick={() => {
          setValue('')
          setInputVal('')
        }} />}
    </div>
  )
}

export default Input
