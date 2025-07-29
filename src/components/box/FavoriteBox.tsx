import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CategoryProps, UserSelectionProps, ProductSortedProps } from '../../types'
import HeartIcon from '../../asset/HeartIcon'
import { fetchCategory } from '../../utils/categoryUtils'
import Button from '../ui/button'

function FavoriteBox({ product, colorIndex, classname, setClicked }: {
  product: ProductSortedProps,
  colorIndex: number,
  classname?: string,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const navigate = useNavigate()
  const [categoryName, setCategoryName] = useState<string>('')
  const [favInfo, setFavInfo] = useState<UserSelectionProps>()
  const [stockAvailable, setStockAvailable] = useState<boolean>(true)

  useEffect(() => {
    fetchCategory().then((res) => {
      const productCategory: CategoryProps = res.find((el: CategoryProps) => el.id === product.category)
      const groupCategory: CategoryProps = res.find((el: CategoryProps) => el.id === productCategory.groupID)
      setCategoryName(groupCategory.name.toLowerCase())
    })

    setFavInfo({ id: product.id, size: 0, color: colorIndex })

    if (product.stock) {
      if (product.size.length === 1) {
        setStockAvailable(product.stock[0][colorIndex] > 0)
      } else {
        const hasValueGreaterThanZero = product.stock.some(inner => inner[0] > 0)
        if (hasValueGreaterThanZero) setStockAvailable(true)
      }
    }
  }, [product])

  useEffect(() => {
    setFavInfo({ id: product.id, size: 0, color: colorIndex })
  }, [colorIndex])

  return (
    <div className={`relative ${classname}`}>
      <HeartIcon info={favInfo} classname='z-10 absolute right-2 top-[calc(100%-160px)]' />
      <div
        onClick={() => navigate(`/products/item?group=${categoryName}&id=${product.id}&color=${colorIndex}`)} key={product.id} className='flex flex-col cursor-pointer'
      >
        <div className='relative'>
          <div className='bg-gray-100 w-full aspect-square rounded-md overflow-hidden'>
            <img src={product.images[colorIndex][0]} alt="Product" className='rounded-md hover:scale-105 duration-500' />
          </div>
        </div>
        <p className='mt-2 text-sm'>{product.name}</p>
        <p className='font-bold text-sm'>€ {product.price.toFixed(2)}</p>
      </div>

      <Button classname='my-4 bg-white border border-gray-500' disabled={!stockAvailable} onClick={() => { setClicked(true) }} >
        {stockAvailable ? 'add' : 'out of stock'}
      </Button>
    </div>
  )
}

export default FavoriteBox