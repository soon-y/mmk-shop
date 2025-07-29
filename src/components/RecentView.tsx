import { useState, useEffect } from 'react'
import type { UserSelectionProps, ProductSortedProps } from '../types'
import { getCookiesProducts } from '../utils/productUtils'
import ItemBox from './box/ItemBox'

function RecentView() {
  const [productsInHistory, setProductsInHistory] = useState<ProductSortedProps[]>([])
  const [userHistory, setUserHistory] = useState<UserSelectionProps[]>([])

  useEffect(() => {
    getCookiesProducts('history').then(({ cookiesItem, filtered }) => {
      setUserHistory(cookiesItem)
      setProductsInHistory(filtered)
    })
  }, [])

  return (
    <div>
      {productsInHistory.length > 0 &&
        <div>
          <div className='uppercase pt-12 px-4 md:px-6 pb-2'>Recently viewed</div>
          <div className='flex overflow-x-auto flex-nowrap hide-scrollbar gap-2 px-4 md:px-6'>
            {productsInHistory.map((item, i) => (
              <ItemBox product={item} color={userHistory[i].color} classname='' key={i} />
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default RecentView