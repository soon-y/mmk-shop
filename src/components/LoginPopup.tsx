import { useEffect, useState } from 'react'
import Popup from './ui/popup'
import Button from './ui/button'
import Input from './ui/input'
import { User } from 'lucide-react'

function LoginPopup({ setClicked }: {
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [email, setEmail] = useState<string>('')
  const [valid, setValid] = useState<boolean>(true)

  useEffect(() => {
    if (email.includes('@')) setValid(true)
    else setValid(false)
  }, [email])

  return (
    <Popup title='log in' setClicked={setClicked}>
      <div className='flex flex-col gap-4'>
        Enter your email address to register as an member or to log in to your account.

        <div>
          <p className='text-sm ml-1'>Email <span className='text-red-500'>*</span></p>
          <Input type='email' setInputVal={setEmail} placeholder='e-mail'>
            <User className='w-6 mx-1 text-gray-400' />
          </Input>

          {!valid && <p className='text-red-500 text-sm'>Please enter a valid email address.</p>}
        </div>

        <Button disabled={!valid}>Continue</Button>

      </div>
    </Popup>
  )
}

export default LoginPopup
