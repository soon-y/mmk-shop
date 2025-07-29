import { useState, useEffect } from 'react'
import RadioButtons from '../../components/ui/radioBtn'
import Klarna from '../../asset/Klarna'
import Master from '../../asset/Master'
import Visa from '../../asset/Visa'
import PayPal from '../../asset/PayPal'
import Input from '../ui/input'
import { useAuth } from '../../context/auth'
import Button from '../ui/button'

function MyPayment() {
  const { user, updateInfo } = useAuth()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [openSelection, setOpenSelction] = useState<boolean>(false)
  const checkoutOptions = [
    {
      value: 'Klarna', item:
        <div>
          <div className='grid grid-cols-2 mt-1'>
            <Klarna />
            <div className='text-right'>
              <p className='uppercase'>pay flexibly</p>
              <p className='text-xs/3'>
                Immediately, in 30 days, in three interest-free installments, or in installments. Interest may apply.
              </p>
            </div>
          </div>
          {selectedOption === 0 &&
            <div className='mt-4'>
              <p>Shop safely with Klarna's <span className='underline'>Buyer Protection</span>. Vew <span className='underline'>payment methods</span>.</p>
              <p className='text-sm/5'>
                The selected payment method is provided by Klarna. By completing a purchase using this payment method, you agree that MMK may share your information with Klarna for payment processing.
              </p>
            </div>
          }
        </div>
    },
    {
      value: 'Visa', item:
        <div>
          <div className='grid grid-cols-2 items-center'>
            <div className='flex gap-2'>
              <Visa /> <Master />
            </div>
            <div className='text-right'>
              <p className='uppercase'>credit card</p>
            </div>
          </div>
          {selectedOption === 1 &&
            <div className='mt-4 md:w-[370px] flex flex-col gap-4'>
              <p className='text-xs'>All fields are mandatory unless otherwise indicated.</p>
              <div>
                <p className='text-sm ml-1 text-gray-500'>Card number</p>
                <Input></Input>
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <p className='text-sm ml-1 text-gray-500'>Expiry date</p>
                  <Input></Input>
                  <p className='text-xs/3 mt-1 text-gray-500'>Front of the card in MM/YY format</p>
                </div>
                <div>
                  <p className='text-sm ml-1 text-gray-500'>Security code</p>
                  <Input></Input>
                  <p className='text-xs ml-4 text-gray-500'>3 digits on the back of the card</p>
                </div>
              </div>

              <div>
                <p className='text-sm ml-1 text-gray-500'>Name on the card</p>
                <Input></Input>
              </div>
            </div>
          }
        </div>
    },
    {
      value: 'PayPal', item:
        <div>
          <div className='grid grid-cols-2 items-center'>
            <PayPal />
            <div className='text-right'>
              <p className='uppercase'>paypal</p>
            </div>
          </div>
          {selectedOption === 2 &&
            <div className='mt-4'>
              <p className='text-sm/5'>
                Once you click "Complete Purcahse", a pop-up will appear prompting you to log in to your PayPal account. Review your payment and shipping details to complete your purchase. You will then be redirected to MMK's order confirmation page.
              </p>
            </div>
          }
        </div>
    },
  ]

  useEffect(() => {
    const index = checkoutOptions.findIndex((el) => el.value === user?.payment)
    setSelectedOption(index)
  }, [user])

  return (
    <div>
      {openSelection ?
        <div className='md:w-[400px]'>
          <p>How would you like to pay?</p>
          <div>
            <RadioButtons options={checkoutOptions} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
          </div>
          <Button onClick={() => {
            setOpenSelction(false)
            updateInfo(user!.id, { payment: checkoutOptions[selectedOption!].value })
          }}>save</Button>
        </div>
        :
        <div>
          {
            selectedOption !== null && selectedOption > -1 &&
            <div>
              {checkoutOptions[selectedOption].value}
            </div>
          }
          <p className=' cursor-pointer underline' onClick={() => setOpenSelction(true)}>Select</p>
        </div>
      }
    </div>
  )
}

export default MyPayment