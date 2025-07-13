import React from 'react'

export type ButtonProps = {
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
  classname?: string
}

const Button = ({ onClick, disabled, children, classname }: ButtonProps) => {

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-full px-4 py-3 rounded ${ classname ? classname : 'bg-black text-white'}
        ${disabled ? 'opacity-20' : ''} ${classname}`}
    >
      <p className='uppercase font-semibold text-sm'>{children}</p>
    </button>
  )
}

export default Button
