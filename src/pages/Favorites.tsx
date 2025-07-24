import { useState, useEffect } from 'react'
import Button from '../components/ui/button'
import HeartIcon from '../asset/HeartIcon'
import { useNavigate } from 'react-router-dom'
import type { UserSelectionProps, ProductSortedProps } from '../types'
import { getCookiesProducts, getUserProducts } from '../utils/productUtils'
import FavoriteBox from '../components/FavoriteBox'
import LeftSidePanel from '../components/RightSidePanel'
import SizeSelection from '../components/SizeSelection'
import AddToCartButton from '../components/AddToCartButton'
import { useAuth } from '../context/auth'
import RecentView from '../components/RecentView'
import AddToCartBox from '../components/AddToCartBox'

function Favorites() {
  const navigate = useNavigate()
  const [clicked, setClicked] = useState<boolean>(false)
  const [products, setProducts] = useState<ProductSortedProps[]>([])
  const [favoriteColor, setFavorites] = useState<UserSelectionProps[]>([])
  const [productIndex, setProductIndex] = useState<number>(0)
  const [colorIndex, setColorIndex] = useState<number>(0)
  const [sizeIndex, setSizeIndex] = useState<number | null>(null)
  const { user } = useAuth()
  const [addtoCart, setAddtoCart] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      getUserProducts('favorites', user.id).then(({ userItem, filtered }) => {
        setFavorites(userItem)
        setProducts(filtered)
      })
    } else {
      getCookiesProducts('favorites').then(({ cookiesItem, filtered }) => {
        setFavorites(cookiesItem)
        setProducts(filtered)
      })
    }
  }, [user])

  useEffect(() => {
    if (products[productIndex]) {
      setSizeIndex(products[productIndex].size.length > 1 ? null : 0)
    }
  }, [products])

  return (
    <div className='mt-[90px] md:mt-[154px] px-4 md:px-6 pb-10'>
      <h1>Favorites</h1>
      {products.length === 0 ?
        <div className='justify-center flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5'>
            <div className='relative aspect-square bg-gray-100 rounded-md overflow-hidden'>
              <img className='blur-[10px] opacity-30' src='https://qfoncqojmqdoqxleuioe.supabase.co/storage/v1/object/public/product-img//1751841317762-k5xgmm.jpg' />
              <HeartIcon activeInit={true} classname='absolute bottom-2 right-2 animate-bounce' />
            </div>
          </div>
          <p className='mt-4' >Tap the heart icon next to articles to save your favorites here.</p>
          <Button onClick={() => navigate('/')} classname='md:w-[200px] text-white bg-black'>Discover more</Button>
        </div> :
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5'>
          {products.map((el, i) => (
            <div key={i} onClick={() => {
              setProductIndex(i)
              setColorIndex(favoriteColor[i].color)
            }}>
              <FavoriteBox product={el} colorIndex={favoriteColor[i].color} key={i} setClicked={setClicked} />
            </div>
          ))}
        </div>
      }

      <RecentView />

      <LeftSidePanel clicked={clicked} setClicked={setClicked}>
        {products.length > 0 &&
          <div className='flex flex-col justify-between p-4 h-[calc(100vh-50px)]'>
            <div className='grid grid-cols-[50%_50%] gap-2'>
              <img className='rounded-md' src={products[productIndex].images[colorIndex][0]} />
              <div>
                <p>{products[productIndex].name}</p>
                <p className='font-semibold'>€ {products[productIndex].price.toFixed(2)}</p>
                {<p className='text-sm'>Selected color: {products[productIndex].color[colorIndex]}</p>}
              </div>
            </div>
            <div>
              <SizeSelection product={products[productIndex]} colorIndex={colorIndex} sizeIndex={sizeIndex} setSizeIndex={setSizeIndex} />
              <AddToCartButton product={products[productIndex]} colorIndex={colorIndex} sizeIndex={sizeIndex} setClicked={setClicked} setAddtoCart={setAddtoCart} />
            </div>
          </div>}
      </LeftSidePanel>

      {products.length > 0 && <AddToCartBox product={products[productIndex]} colorIndex={colorIndex} sizeIndex={sizeIndex} addtoCart={addtoCart} />}
    </div>
  )
}

export default Favorites
