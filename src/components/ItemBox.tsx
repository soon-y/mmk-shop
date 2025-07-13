import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProductProps } from '../types'
import HeartIcon from '../asset/HeartIcon'
import { imgCount } from '../utils/productUtils'
import { getCategoryGroupName } from '../utils/categoryUtils'
import { getCookie } from '../utils/cookieUtils'

function ItemBox({ product, color, classname }: {
  product: ProductProps,
  color?: number,
  classname?: string
}) {
  const navigate = useNavigate()
  const [categoryName, setCategoryName] = useState<string>('')
  const [liked, setLiked] = useState<boolean | null>(null)
  const [colorIndex, setColorIndex] = useState<number>(color ? color : 0)
  const imageCount: number[] = imgCount(product.imagesCount)
  const [info, setInfo] = useState<string>('')

  useEffect(() => {
    getCategoryGroupName(product.category).then((result) => {
      setCategoryName(result)
    })

    setInfo(product.id.toString() + '/' + colorIndex)

    const favorite = getCookie('favorites')
    if (favorite.includes(product.id.toString() + '/' + color)) setLiked(true)
  }, [])

  useEffect(() => {
    setInfo(product.id.toString() + '/' + colorIndex)
  }, [colorIndex])

  return (
    <div className={`relative ${classname}`}>
      <HeartIcon info={info} className='duration-500 hover:scale-110 cursor-pointer absolute right-2 top-[calc(100%-124px)] z-10' active={liked} onClick={() => setLiked(prev => !prev)} />
      <div
        onClick={() => navigate(`/products/item?group=${categoryName}&id=${product.id}&color=${colorIndex}`)} key={product.id} className='flex flex-col cursor-pointer'
      >
        <div className='relative'>
          <div className='w-full aspect-square rounded-md overflow-hidden'>
            <img src={product.images[imageCount[colorIndex]]} alt="Product" className='rounded-md hover:scale-105 duration-500' />
          </div>
        </div>
        <p className='mt-2 text-sm'>{product.name}</p>
        <p className='font-bold text-sm'>€ {product.price}</p>
        <p className="text-xs flex gap-1">
          {product.size.split('/').map((size, i) => (
            <span key={i}>{size}</span>
          ))}
        </p>
      </div>

      <p className="text-sm flex gap-1">
        {product.colorHex.split('/').map((color, i) => (
          <span key={i} className="cursor-pointer w-5 my-1 aspect-square rounded-full border-2" onClick={() => { setColorIndex(i) }} style={{
            backgroundColor: color
          }}></span>
        ))}
      </p>
    </div>
  )
}

export default ItemBox