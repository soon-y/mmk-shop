import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProductResultProps } from '../../types'
import HeartIcon from '../../asset/HeartIcon'

function ResultBox({ product, color, setClicked }: {
  product: ProductResultProps,
  color?: string,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const navigate = useNavigate()
  const [colorIndex, setColorIndex] = useState<number>(0)
  const [favInfo, setFavInfo] = useState<{ id: number, size: number, color: number }>({ id: 0, size: 0, color: 0 })

  useEffect(() => {
    setFavInfo({ id: product.id, size: 0, color: colorIndex })
  }, [])

  useEffect(() => {
    if (color && color !== '') {
      const index = product.color.findIndex((el) => el.toLowerCase() === color.toLowerCase())
      setColorIndex(index !== -1 ? index : 0)
    } else setColorIndex(0)
  }, [color])

  useEffect(() => {
    setFavInfo({ id: product.id, size: 0, color: colorIndex })
  }, [colorIndex])

  return (
    <div className='grid grid-cols-[180px_1fr] gap-4'>
      <div className='relative'>
        <div className='w-full aspect-square rounded-md overflow-hidden' onClick={() => {
          navigate(`/products/item?group=${product.category}&id=${product.id}&color=${colorIndex}`)
          setClicked(false)
        }}>
          <img src={product.images[colorIndex][0]} alt="Product" className=' cursor-pointer rounded-md hover:scale-105 duration-500' />
        </div>
        <HeartIcon info={favInfo} classname='absolute right-2 top-1 z-10' />
      </div>

      <div className='h-full flex flex-col gap-1 text-sm'>
        <p>{product.name}</p>
        <p className='font-bold'>€ {product.price}</p>
        <p className="flex gap-1">
          Size:
          {product.size.map((size, i) => (
            <span key={i} className={`${product.stock[i][colorIndex] > 0 ? 'font-semibold' : 'line-through text-gray-400'}`}>{size}</span>
          ))}
        </p>

        <p className="text-sm flex gap-1">
          {product.colorHex.map((color, i) => (
            <span key={i} className="cursor-pointer w-5 my-1 aspect-square rounded-full border-2" onClick={() => { setColorIndex(i) }} style={{
              backgroundColor: color
            }}></span>
          ))}
        </p>
        <p>Material: {product.material}</p>
        <p className='text-magenta'>{product.size.length === 1 ?
          product.stock[0][colorIndex] > 0 ? '' : 'Out of stock' : ''}</p>
      </div>
    </div>
  )
}

export default ResultBox