import { useState, useEffect } from 'react'
import { useAuth } from '../../context/auth'
import Input from '../ui/input'
import Button from '../ui/button'

function MyInfo() {
  const { user, updateInfo } = useAuth()
  const [editable, setEditable] = useState<boolean>(false)
  const [firstName, setFirstName] = useState<string | undefined>('')
  const [lastName, setLastName] = useState<string | undefined>('')
  const [contact, setContact] = useState<string | undefined>('')
  useEffect(() => {
    setFirstName(user?.firstName)
    setLastName(user?.lastName)
    setContact(user?.contact)
  }, [user])

  return (
    <div className='my-4'>
      {!editable ?
        <div>
          <p>{user?.email}</p>
          <p>{firstName} {lastName}</p>
          {user?.contact ?
            <p>{user?.contact}</p> :
            <p className='underline cursor-pointer text-red-500' onClick={() => setEditable(true)}>Please add your contact</p>
          }

          <p className='underline cursor-pointer' onClick={() => setEditable(true)}>Edit</p>
        </div>
        :
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setEditable(false)
            updateInfo(user!.id, { firstName, lastName, contact })
          }}
          className="md:w-[400px] flex flex-col gap-4"
        >
          <div>
            <p className='text-sm ml-1 text-gray-500'>Email <span className='text-red-500'>*</span></p>
            <Input required initial={user?.email} readOnly></Input>
          </div>
          <div>
            <p className='text-sm ml-1 text-gray-500'>First Name <span className='text-red-500'>*</span></p>
            <Input required initial={user?.firstName} setInputVal={setFirstName}></Input>
          </div>
          <div>
            <p className='text-sm ml-1 text-gray-500'>Last Name <span className='text-red-500'>*</span></p>
            <Input required initial={user?.lastName} setInputVal={setLastName}></Input>
          </div>
          <div>
            <p className='text-sm ml-1 text-gray-500'>Contact <span className='text-red-500'>*</span></p>
            <Input required type='number' initial={user?.contact} setInputVal={setContact} placeholder='49'></Input>
          </div>
          <div className='flex flex-col gap-4 mt-4'>
            <Button type='submit'>save</Button>
            <Button classname='border' onClick={() => setEditable(false)}>cancel</Button>
          </div>
        </form>
      }
    </div>
  )
}

export default MyInfo
