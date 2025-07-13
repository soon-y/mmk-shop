import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProductResultProps } from '../types'
import HeartIcon from '../asset/HeartIcon'
import { imgCount } from '../utils/productUtils'
import { getCookie } from '../utils/cookieUtils'

function ResultBox({ product, color, setClicked }: {
  product: ProductResultProps,
  color?: string,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState<boolean | null>(null)
  const [colorIndex, setColorIndex] = useState<number>(0)
  const imageCount: number[] = imgCount(product.imagesCount)
  const [info, setInfo] = useState<string>('')

  useEffect(() => {
    setInfo(product.id.toString() + '/' + colorIndex)

    const favorite = getCookie('favorites')
    if (favorite.includes(product.id.toString() + '/' + color)) setLiked(true)
  }, [])

  useEffect(() => {
    if (color && color !== '') {
      const index = product.color.toLowerCase().split('/').indexOf(color.toLowerCase())
      setColorIndex(index !== -1 ? index : 0)
    } else setColorIndex(0)
  }, [color])

  useEffect(() => {
    setInfo(product.id.toString() + '/' + colorIndex)
  }, [colorIndex])

  return (
    <div className='grid grid-cols-[180px_1fr] gap-2'>
      <div className='relative'>
        <div className='w-full aspect-square rounded-md overflow-hidden' onClick={() => {
          navigate(`/products/item?group=${product.category}&id=${product.id}&color=${colorIndex}`)
          setClicked(false)
        }}>
          <img src={product.images[imageCount[colorIndex]]} alt="Product" className=' cursor-pointer rounded-md hover:scale-105 duration-500' />
        </div>
        <HeartIcon info={info} className='duration-500 hover:scale-110 cursor-pointer absolute right-2 top-1 z-10' active={liked} onClick={() => setLiked(prev => !prev)} />
      </div>

      <div className='h-full justify-center flex flex-col gap-1 text-sm'>
        <p>{product.name}</p>
        <p className='font-bold'>€ {product.price}</p>
        <p className="flex gap-1">
          Size:
          {product.size.split('/').map((size, i) => (
            <span key={i} className={`${product.stock[i][colorIndex] > 0 ? 'font-semibold' : 'line-through text-gray-400'}`}>{size}</span>
          ))}
        </p>

        <p className="text-sm flex gap-1">
          {product.colorHex.split('/').map((color, i) => (
            <span key={i} className="cursor-pointer w-5 my-1 aspect-square rounded-full border-2" onClick={() => { setColorIndex(i) }} style={{
              backgroundColor: color
            }}></span>
          ))}
        </p>
        <p>Material: {product.material}</p>
        <p>{product.size.split('/').length === 1 ?
          product.stock[0][colorIndex] > 0 ? '' : 'Out of stock' : ''}</p>
      </div>
    </div>
  )
}

export default ResultBox