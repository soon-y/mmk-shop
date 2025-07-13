import { useState, useEffect } from 'react'
import Button from '../components/ui/button'
import HeartIcon from '../asset/HeartIcon'
import { useNavigate } from 'react-router-dom'
import type { ProductProps } from '../types'
import { getCookieProducts, grouppingStock } from '../utils/productUtils'
import FavoriteBox from '../components/FavoriteBox'
import LeftSidePanel from '../components/RightSidePanel'
import SizeSelection from '../components/SizeSelection'
import AddButton from '../components/AddToCartButton'


function Favorites() {
  const navigate = useNavigate()
  const [clicked, setClicked] = useState<boolean>(false)
  const [products, setProducts] = useState<ProductProps[]>([])
  const [favoriteColor, setFavorites] = useState<string[]>([])
  const [productIndex, setProductIndex] = useState<number>(0)
  const [colorIndex, setColorIndex] = useState<number>(0)
  const [imageCount, setImageCount] = useState<number[][]>([])
  const [sizeIndex, setSizeIndex] = useState<number | null>(null)

  useEffect(() => {
    getCookieProducts('favorites').then(({ cookieName, filtered, imgCountArr }) => {
      setFavorites(cookieName)
      setProducts(filtered)
      setImageCount(imgCountArr)
    })
  }, [])

  useEffect(() => {
    if (products[productIndex]) {
      setSizeIndex(products[productIndex].size.split('/').length > 1 ? null : 0)
    }
  }, [productIndex])

  return (
    <div className='mt-[90px] md:mt-[165px] px-4 md:px-6 pb-10'>
      <h1>Favorites</h1>
      {products.length === 0 ?
        <div className='justify-center flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5'>
            <div className='relative aspect-square bg-gray-100 rounded-md overflow-hidden'>
              <img className='blur-[10px] opacity-30' src='https://qfoncqojmqdoqxleuioe.supabase.co/storage/v1/object/public/product-img//1751841317762-k5xgmm.jpg' />
              <HeartIcon active={true} className='absolute bottom-2 right-2 animate-bounce' />
            </div>
          </div>
          <p className='mt-4' >Tap the heart icon next to articles to save your favorites here.</p>
          <Button onClick={() => navigate('/')} classname='md:w-[200px] text-white bg-black'>Discover more</Button>
        </div> :
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5'>
          {products.map((el, i) => (
            <div key={i} onClick={() => {
              setProductIndex(i)
              setColorIndex(Number(favoriteColor[i].split('/')[1]))
            }}>
              <FavoriteBox product={el} stock={grouppingStock(products[i].stock)} color={Number(favoriteColor[i].split('/')[1])} key={i} setClicked={setClicked} />
            </div>
          ))}
        </div>
      }

      <LeftSidePanel clicked={clicked} setClicked={setClicked}>
        {products.length > 1 &&
          <div className='flex flex-col justify-between p-4 h-[calc(100vh-50px)]'>
            <div className='grid grid-cols-[50%_50%] gap-2'>
              <img className='rounded-md' src={products[productIndex].images[imageCount[productIndex][colorIndex]]} />
              <div>
                <p>{products[productIndex].name}</p>
                <p className='font-semibold'>€ {products[productIndex].price}</p>
                {<p className='text-sm'>Selected color: {products[productIndex].color.split('/')[colorIndex]}</p>}
              </div>
            </div>
            <div>
              <SizeSelection product={products[productIndex]} colorID={colorIndex} sizeID={sizeIndex} stock={grouppingStock(products[productIndex].stock)} setSizeID={setSizeIndex} />
              <AddButton id={products[productIndex].id} colorID={colorIndex} sizeID={sizeIndex} stock={grouppingStock(products[productIndex].stock)} setClicked={setClicked} />
            </div>
          </div>}
      </LeftSidePanel>
    </div>
  )
}

export default Favorites
