import { useEffect, useState } from 'react'
import type { ProductProps, ProductSortedProps } from '../types'
import { fetchProducts, sortProductData } from '../utils/productUtils'
import ItemBox from './ItemBox'

function SimilarProducts({ category, productIndex }: { category: number, productIndex: number }) {
  const [products, setProducts] = useState<ProductSortedProps[]>()

  useEffect(() => {
    fetchProducts().then((res) => {
      const filtered = res.filter((el: ProductProps) =>
        el.category === category && el.id !== productIndex
      )
      const sorted = filtered.map((el: ProductProps) => { return sortProductData(el) })
      setProducts(sorted)

      if (filtered.length === 0) return
    })
  }, [category, productIndex])

  if (!category && !productIndex) return

  return (
    <div className='mb-6'>
      {products && products.length > 0 &&
        <div className='p-4 md:p-0 '>
          <p className='font-bold py-2'>Similar products</p>

          {products.map((product) => (
            <div key={product.id} className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-2 flex-wrap'>
              <ItemBox product={product} key={product.id} />
            </div>
          ))}

        </div>
      }
    </div>
  )
}

export default SimilarProducts