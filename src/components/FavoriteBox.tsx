import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CategoryProps, ProductProps } from '../types'
import HeartIcon from '../asset/HeartIcon'
import { imgCount } from '../utils/productUtils'
import { fetchCategory } from '../utils/categoryUtils'
import { getCookie } from '../utils/cookieUtils'
import Button from './ui/button'

function FavoriteBox({ product, color, stock, classname, setClicked }: {
  product: ProductProps,
  color: number,
  stock: number[][],
  classname?: string,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const navigate = useNavigate()

  const [categoryName, setCategoryName] = useState<string>('')
  const [liked, setLiked] = useState<boolean | null>(null)
  const imageCount: number[] = imgCount(product.imagesCount)
  const [info, setInfo] = useState<string>('')
  const [stockAvailable, setStockAvailable] = useState<boolean>(true)

  useEffect(() => {
    fetchCategory().then((res) => {
      const productCategory: CategoryProps = res.find((el: CategoryProps) => el.id === product.category)
      const groupCategory: CategoryProps = res.find((el: CategoryProps) => el.id === productCategory.groupID)
      setCategoryName(groupCategory.name.toLowerCase())
    })

    setInfo(product.id.toString() + '/' + color)

    if (stock) {
      if (product.size.split('/').length === 1) {
        setStockAvailable(stock[0][color] > 0)
      } else {
        const hasValueGreaterThanZero = stock.some(inner => inner[0] > 0)
        if (hasValueGreaterThanZero) setStockAvailable(true)
      }
    }

    const favorite = getCookie('favorites')
    if (favorite.includes(product.id.toString())) setLiked(true)
  }, [])

  useEffect(() => {
    setInfo(product.id.toString() + '/' + color)
  }, [color])

  return (
    <div className={`relative ${classname}`}>
      <HeartIcon info={info} className='z-10 duration-500 hover:scale-110 cursor-pointer absolute right-2 top-[calc(100%-160px)]' active={liked} onClick={() => setLiked(prev => !prev)} />
      <div
        onClick={() => navigate(`/products/item?group=${categoryName}&id=${product.id}&color=${color}`)} key={product.id} className='flex flex-col cursor-pointer'
      >
        <div className='relative'>
          <div className='bg-gray-100 w-full aspect-square rounded-md overflow-hidden'>
            <img src={product.images[imageCount[color]]} alt="Product" className='rounded-md hover:scale-105 duration-500' />
          </div>
        </div>
        <p className='mt-2 text-sm'>{product.name}</p>
        <p className='font-bold text-sm'>€ {product.price}</p>
      </div>

      <Button classname='my-4 bg-white border border-gray-500' disabled={!stockAvailable} onClick={() => {setClicked(true)}} >
        {stockAvailable ? 'add' : 'out of stock'}
      </Button>
    </div>
  )
}

export default FavoriteBox