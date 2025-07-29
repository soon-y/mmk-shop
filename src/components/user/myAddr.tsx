import { useState, useEffect, type ReactNode } from 'react'
import { useAuth } from '../../context/auth'
import Button from '../ui/button'
import RadioButtons from '../ui/radioBtn'
import type { AddrProps } from '../../types'
import AddrForm from './addrForm'

function Myaddr() {
  const { addr, updateAddrSelection } = useAuth()
  const [addNew, setAddNew] = useState<boolean>(false)
  const [selectAddr, setSelectAddr] = useState<boolean>(false)
  const [editable, setEditable] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [addrArray, setAddrArray] = useState<{ item: ReactNode }[]>()

  useEffect(() => {
    if (addr) {
      const selectedselectedOption = addr.findIndex(el => el.select === true)
      setSelectedOption(selectedselectedOption)

      setAddrArray(
        addr.map((el: AddrProps, i: number) => ({
          item: (
            <div key={i}>
              <p>{el.firstName} {el.lastName}</p>
              <p>{el.contact}</p>
              <p>{el.street}</p>
              <p>{el.postalCode}</p>
              <p>{el.city}</p>
              <p>{el.country}</p>
            </div>
          ),
          info: { id: el.id, index: el.index, target: 'address', select: el.select }
        }))
      )
    }
  }, [addr])

  if (!addr || selectedOption === null || !addr[selectedOption]) return (
    <div className='animate-pulse flex flex-col gap-2 mt-6'>
      {Array.from({ length: 6 }).map((_, i) => (
        <p key={i} className='w-1/2 h-5 bg-gray-100'></p>
      ))}
    </div>
  )

  return (
    <div className='my-4'>
      {!addr[selectedOption].contact || !addr[selectedOption].street ?
        !editable ?
          <div>
            <p>{addr[selectedOption].firstName} {addr[selectedOption].lastName}</p>
            {addr[selectedOption].contact ?
              <p>{addr[selectedOption].contact}</p> :
              <p className='underline cursor-pointer text-red-500' onClick={() => setEditable(true)}>Please add your contact</p>
            }
            {addr[selectedOption].street ?
              <div className='my-2'>
                <p>{addr[selectedOption].street}</p>
                <p>{addr[selectedOption].postalCode}</p>
                <p>{addr[selectedOption].city}</p>
                <p>{addr[selectedOption].country}</p>
              </div> :
              <p className='underline cursor-pointer text-red-500' onClick={() => setEditable(true)}>Please add your address</p>
            }
          </div>
          :
          <AddrForm address={addr![selectedOption]} setEditable={setEditable} action='update' target='address' />
        :
        !selectAddr ?
          <div>
            <p>{addr[selectedOption].firstName} {addr[selectedOption].lastName}</p>
            {addr[selectedOption].contact ?
              <p>{addr[selectedOption].contact}</p> :
              <p className='underline cursor-pointer text-red-500' onClick={() => setEditable(true)}>Please add your contact</p>
            }
            {addr[selectedOption].street ?
              <div className='my-2'>
                <p>{addr[selectedOption].street}</p>
                <p>{addr[selectedOption].postalCode}</p>
                <p>{addr[selectedOption].city}</p>
                <p>{addr[selectedOption].country}</p>
              </div> :
              <p className='underline cursor-pointer text-red-500' onClick={() => setEditable(true)}>Please add your address</p>
            }
            <p className='underline inline mr-4 cursor-pointer' onClick={() => setSelectAddr(true)}>Select</p>
          </div>
          :
          !editable ?
            <div>
              <RadioButtons options={addrArray ?? []} selectedOption={selectedOption} setSelectedOption={setSelectedOption} editable setEditable={setEditable} />

              {!addNew ?
                <div className='md:w-[400px] flex flex-col gap-4'>
                  <p className='underline cursor-pointer' onClick={() => setAddNew(true)}>Add</p>
                  <Button onClick={() => {
                    setSelectAddr(false)
                    updateAddrSelection(addr[selectedOption].id, addr[selectedOption].index, 'address')
                  }}>save
                  </Button>
                </div>
                :
                <div>
                  <h3 className='p-1'>Add new address</h3>
                  <AddrForm setEditable={setAddNew} action='add' target='address' />
                </div>
              }
            </div>
            :
            <AddrForm address={addr![selectedOption]} setEditable={setEditable} action='update' target='address' />
      }
    </div>
  )
}

export default Myaddr
