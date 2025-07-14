import React from 'react'

export type ButtonProps = {
  type?: "button" | "submit" | "reset" | undefined
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
  classname?: string
}

const Button = ({ type, onClick, disabled, children, classname }: ButtonProps) => {

  return (
    <button
      type={type? type : 'button'}
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-full px-4 py-3 rounded border-gray-500 ${classname ? classname : 'bg-black text-white'}
        ${disabled ? 'opacity-20' : ''} ${classname}`}
    >
      <p className='uppercase font-semibold text-sm flex items-center justify-center'>{children}</p>
    </button>
  )
}

export default Button
