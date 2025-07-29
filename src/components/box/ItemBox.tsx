import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProductSortedProps } from '../../types'
import HeartIcon from '../../asset/HeartIcon'
import { getCategoryGroupName } from '../../utils/categoryUtils'
import { urlGenerator } from '../../utils/productUtils'

function ItemBox({ product, color, classname }: {
  product: ProductSortedProps,
  color?: number,
  classname?: string
}) {
  const navigate = useNavigate()
  const [categoryName, setCategoryName] = useState<string>('')
  const [colorIndex, setColorIndex] = useState<number>(color && color !== undefined ? color : 0)
  const [favInfo, setFavInfo] = useState<{ id: number, size: number, color: number }>({ id: 0, size: 0, color: 0 })

  useEffect(() => {
    getCategoryGroupName(product.category).then((result) => {
      setCategoryName(result)
    })

    setFavInfo({ id: product.id, size: 0, color: colorIndex })
  }, [])

  useEffect(() => {
    setFavInfo({ id: product.id, size: 0, color: colorIndex })
  }, [colorIndex])

  return (
    <div className={`relative ${classname} min-w-[140px]`}>
      <HeartIcon info={favInfo} classname='absolute right-2 top-[calc(100%-124px)] z-10' />
      <div
        onClick={() => navigate(urlGenerator(categoryName, product.id, colorIndex))} key={product.id} className='flex flex-col cursor-pointer'
      > 
        <div>
          <div className='w-full aspect-square rounded-md overflow-hidden'>
            <img src={product.images[colorIndex][0]} alt="Product" className='rounded-md hover:scale-105 duration-500' />
          </div>
        </div>
        <p className='mt-2 text-sm'>{product.name}</p>
        <p className='font-bold text-sm'>€ {product.price.toFixed(2)}</p>
        <p className="text-xs flex gap-1">
          {product.size.map((el, i) => (
            <span key={i}>{el}</span>
          ))}
        </p>
      </div>

      <p className="text-sm flex gap-1">
        {product.colorHex.map((el, i) => (
          <span key={i} className="cursor-pointer w-5 my-1 aspect-square rounded-full border-2" onClick={() => { setColorIndex(i) }} style={{
            backgroundColor: el
          }}>
          </span>
        ))}
      </p>
    </div>
  )
}

export default ItemBox