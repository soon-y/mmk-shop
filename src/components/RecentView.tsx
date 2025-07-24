import { useState, useEffect } from 'react'
import type { UserSelectionProps, ProductSortedProps } from '../types'
import { getCookiesProducts } from '../utils/productUtils'
import ItemBox from '../components/ItemBox'

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
          <div className='uppercase pt-12 mb-2'>Recently viewed</div>
          <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-4 flex-wrap'>
            {productsInHistory.slice(0, 12).map((item, i) => (
              <div key={i}>
                <ItemBox product={item} color={userHistory[i].color} />
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default RecentView