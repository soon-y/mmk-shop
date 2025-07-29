import { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth'
import Input from '../ui/input'
import Button from '../ui/button'
import type { AddrProps } from '../../types'

function addressForm({ address, action, target, setEditable }: {
  address?: AddrProps,
  action: string,
  target: string,
  setEditable: React.Dispatch<React.SetStateAction<boolean>>,
}) {
  const { user, updateAddr, addr, addAddr, updateBillingAddr, addBillingAddr, updateAddrSelection } = useAuth()
  const [sameAsDeliveryAddr, setSameAsDeliveryAddr] = useState<boolean>(false)
  const [firstName, setFirstName] = useState<string | undefined>(address ? address.firstName : '')
  const [lastName, setLastName] = useState<string | undefined>(address ? address.lastName : '')
  const [contact, setContact] = useState<string | undefined>(address ? address.contact : '')
  const [street, setStreet] = useState<string | undefined>(address ? address.street : '')
  const [postalCode, setPostalCode] = useState<string | undefined>(address ? address.postalCode : '')
  const [city, setCity] = useState<string | undefined>(address ? address.city : '')
  const [country, setCountry] = useState<string | undefined>(address ? address.country : '')

  useEffect(() => {
    if (target.includes('billing') && addr && sameAsDeliveryAddr) {
      const currentAddrIndex = addr?.findIndex((el: AddrProps) => (el.select === true))
      setFirstName(addr[currentAddrIndex].firstName)
      setLastName(addr[currentAddrIndex].lastName)
      setContact(addr[currentAddrIndex].contact)
      setStreet(addr[currentAddrIndex].street)
      setPostalCode(addr[currentAddrIndex].postalCode)
      setCity(addr[currentAddrIndex].city)
      setCountry(addr[currentAddrIndex].country)
    }
  }, [sameAsDeliveryAddr])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setEditable(false)
        if (action === 'update') {
          if (target === 'address') {
            updateAddr(address!.id, address!.index, { firstName, lastName, contact, street, postalCode, city, country })
            updateAddrSelection(address!.id, address!.index, target)
          }
          if (target === 'billing') {
            updateBillingAddr(address!.id, address!.index, { firstName, lastName, contact, street, postalCode, city, country })
            updateAddrSelection(address!.id, address!.index, target)
          }
        }

        if (target === 'address' && action === 'add') addAddr({ id: user!.id, firstName, lastName, contact, street, postalCode, city, country })
        if (target === 'billing' && action === 'add') addBillingAddr({ id: user!.id, firstName, lastName, contact, street, postalCode, city, country })
      }}
      className="md:w-[400px] flex flex-col gap-4"
    >
      {target.includes('billing') &&
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={sameAsDeliveryAddr} onChange={(e) => setSameAsDeliveryAddr(e.target.checked)} />
          <span>Same as current delivery information</span>
        </label>
      }

      <div>
        <p className='text-sm ml-1 text-gray-500'>First Name <span className='text-red-500'>*</span></p>
        <Input required initial={firstName} setInputVal={setFirstName}></Input>
      </div>
      <div>
        <p className='text-sm ml-1 text-gray-500'>Last Name <span className='text-red-500'>*</span></p>
        <Input required initial={lastName} setInputVal={setLastName}></Input>
      </div>
      <div>
        <p className='text-sm ml-1 text-gray-500'>Contact <span className='text-red-500'>*</span></p>
        <Input required type='number' initial={contact} setInputVal={setContact} placeholder='49'></Input>
      </div>
      <div>
        <p className='text-sm ml-1 text-gray-500'>Street <span className='text-red-500'>*</span></p>
        <Input required initial={street} setInputVal={setStreet}></Input>
      </div>
      <div>
        <p className='text-sm ml-1 text-gray-500'>Postal Code <span className='text-red-500'>*</span></p>
        <Input required initial={postalCode} setInputVal={setPostalCode}></Input>
      </div>
      <div>
        <p className='text-sm ml-1 text-gray-500'>City <span className='text-red-500'>*</span></p>
        <Input required initial={city} setInputVal={setCity}></Input>
      </div>
      <div>
        <p className='text-sm ml-1 text-gray-500'>Country <span className='text-red-500'>*</span></p>
        <Input required initial={country} setInputVal={setCountry}></Input>
      </div>
      <div className='flex flex-col gap-4 mt-4'>
        <Button type='submit'>save</Button>
        <Button classname='border' onClick={() => setEditable(false)}>cancel</Button>
      </div>
    </form>
  )
}

export default addressForm
