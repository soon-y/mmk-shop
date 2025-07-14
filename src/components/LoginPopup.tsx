import { useEffect, useState, type ReactNode } from 'react'
import Popup from './ui/popup'
import Button from './ui/button'
import Input from './ui/input'
import { Check, CircleAlert, LoaderCircle, RectangleEllipsis, User } from 'lucide-react'
import { findCustomerByEmail, register } from '../utils/profileUtils'
import { useAuth } from '../context/auth'

function LoginPopup({ setClicked }: {
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [email, setEmail] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [validEmail, setValidEmail] = useState<boolean>(true)
  const [validName, setValidName] = useState<boolean>(true)
  const [password, setPassword] = useState<string>('')
  const [passwordGuid, setPasswordGuid] = useState<ReactNode[]>()
  const [validPassword, setValidPassword] = useState<boolean>(true)
  const [registered, setRegistered] = useState<boolean | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [unauthorized, setUnauthorized] = useState<boolean>(false)
  const { login } = useAuth()

  useEffect(() => {
    if (email !== '' && !email.includes('@')) setValidEmail(false)
    else setValidEmail(true)
  }, [email])

  useEffect(() => {
    if (firstName !== '' && lastName !== '') setValidName(true)
    else setValidName(false)
  }, [firstName, lastName])

  useEffect(() => {
    const msg: ReactNode[] = []

    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const isProperLength = password.length >= 8 && password.length < 26
    const hasNoSpaces = !/\s/.test(password)

    if (hasLowercase) msg.push(<p className='flex items-center text-green-600'><Check className='w-4 mr-1' /> 1 lowercase letter</p>)
    else msg.push(<p className='flex items-center text-red-500'><CircleAlert className='w-4 mr-1' /> 1 lowercase letter</p>)

    if (hasUppercase) msg.push(<p className='flex items-center text-green-600'><Check className='w-4 mr-1' />1 capital letter</p>)
    else msg.push(<p className='flex items-center text-red-500'><CircleAlert className='w-4 mr-1' />1 capital letter</p>)

    if (hasNumber) msg.push(<p className='flex items-center text-green-600'><Check className='w-4 mr-1' />1 digit</p>)
    else msg.push(<p className='flex items-center text-red-500'><CircleAlert className='w-4 mr-1' />1 digit</p>)

    if (isProperLength) msg.push(<p className='flex items-center text-green-600'><Check className='w-4 mr-1' />8-25 characters</p>)
    else msg.push(<p className='flex items-center text-red-500'><CircleAlert className='w-4 mr-1' />8-25 characters</p>)

    if (hasNoSpaces) msg.push(<p className='flex items-center text-green-600'><Check className='w-4 mr-1' />No spaces</p>)
    else msg.push(<p className='flex items-center text-red-500'><CircleAlert className='w-4 mr-1' />No spaces</p>)

    setPasswordGuid(msg)

    if (hasLowercase && hasUppercase && hasNumber && isProperLength && hasNoSpaces) {
      setValidPassword(true)
    } else {
      setValidPassword(false)
    }
  }, [password])

  const checkCustomerRegisterd = async () => {
    setLoading(true)
    findCustomerByEmail(email).then((res) => {
      setRegistered(res)
      setLoading(false)
    })
  }

  const registerCustomer = async () => {
    setLoading(true)
    register(email, password, firstName, lastName).then((res) => {
      if (res) {
        setRegistered(true)
        setLoading(false)
      }
    })
  }

  const loginCustomer = async () => {
    setLoading(true)
    login(email, password).then((res) => {
      if (res === 'unauthorized') {
        setUnauthorized(true)
        setLoading(false)
      } else if (res && (res.status === 200 || res.status === 201)) {
        setUnauthorized(false)
        setLoading(false)
        setClicked(false)
      } else {
        console.error('Unknown login error')
      }
    })
  }

  return (
    <div>
      {registered === null &&
        <Popup title='log in' setClicked={setClicked}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              checkCustomerRegisterd()
            }}
            className="flex flex-col gap-4"
          >
            Enter your email address to register as an member or to log in to your account.
            <div>
              <p className='text-sm m-1'>Email <span className='text-red-500'>*</span></p>
              <Input type='email' setInputVal={setEmail} placeholder='e-mail'>
                <User className='w-5 mx-2 text-gray-400' />
              </Input>
              {!validEmail && <p className='text-red-500 text-sm'>Please enter a validEmail email address.</p>}
            </div>
            <Button type='submit' disabled={!(validEmail && email !== '')}>
              {loading ? <LoaderCircle className='animate-spin w-4 h-4 my-[2px]' /> : 'Continue'}
            </Button>
          </form>
        </Popup>
      }

      {registered === false &&
        <Popup title='register' setClicked={setClicked}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              registerCustomer()
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <p className='text-sm ml-1 text-gray-500'>Email <span className='text-red-500'>*</span></p>
              <Input type='email' setInputVal={setEmail} readOnly={true} initial={email}>
                <User className='w-5 mx-2 text-gray-400' />
              </Input>
            </div>

            <div>
              <p className='text-sm ml-1 text-gray-500'>Password <span className='text-red-500'>*</span></p>
              <Input type='password' setInputVal={setPassword}>
                <RectangleEllipsis className='w-5 mx-2 text-gray-400' />
              </Input>
              <div className='my-1 flex flex-wrap gap-x-2 gap-y-0'>
                {passwordGuid?.map((el, i) => (
                  <div className='shrink-0 text-xs' key={i}>{el}</div>
                ))}
              </div>
            </div>

            <div className='mb-6'>
              <p className='text-sm ml-1 text-gray-500'>First Name <span className='text-red-500'>*</span></p>
              <Input setInputVal={setFirstName}>
                <User className='w-5 mx-2 text-gray-400' />
              </Input>

              <p className='mt-2 text-sm ml-1 text-gray-500'>Last Name <span className='text-red-500'>*</span></p>
              <Input setInputVal={setLastName}>
                <User className='w-5 mx-2 text-gray-400' />
              </Input>
            </div>

            <Button type='submit' disabled={!(validName && validPassword)}>
              {loading ? <LoaderCircle className='animate-spin w-4 h-4 my-[2px]' /> : 'Continue'}
            </Button>
            <Button classname='border bg-white' onClick={() => setRegistered(null)}>Back to Login</Button>
          </form>
        </Popup>
      }

      {registered === true &&
        <Popup title='Log in' setClicked={setClicked}>
          <p className='my-4'>Please log in with your email address and password.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              loginCustomer()
            }}
            className='flex flex-col gap-4'
          >
            <div>
              <p className='text-sm ml-1 text-gray-500'>
                Email <span className='text-red-500'>*</span>
              </p>
              <Input type='email' setInputVal={setEmail} readOnly={true} initial={email}>
                <User className='w-5 mx-2 text-gray-400' />
              </Input>
            </div>

            <div className='mb-6'>
              <p className='text-sm ml-1 text-gray-500'>
                Password <span className='text-red-500'>*</span>
              </p>
              <Input type='password' setInputVal={setPassword}>
                <RectangleEllipsis className='w-5 mx-2 text-gray-400' />
              </Input>
              {unauthorized && (
                <p className='text-red-500 text-sm mt-1 '>
                  Password is incorrect. Please try again.
                </p>
              )}
            </div>

            <div>
              <Button type='submit' disabled={!(email && password)}>
                {loading ? (
                  <LoaderCircle className='animate-spin w-4 h-4 my-[2px]' />) : ('Continue')}
              </Button>
            </div>

            <Button classname='border bg-white' onClick={() => setRegistered(null)} type='button'>
              Back to Login
            </Button>
          </form>

          <p className='underline pt-8 text-center'>Forgot your password?</p>
        </Popup>
      }

    </div>
  )
}

export default LoginPopup
