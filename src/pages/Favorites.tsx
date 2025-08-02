import { useState, useEffect } from 'react'
import Button from '../components/ui/button'
import HeartIcon from '../asset/HeartIcon'
import { useNavigate } from 'react-router-dom'
import type { UserSelectionProps, ProductSortedProps } from '../types'
import FavoriteBox from '../components/box/FavoriteBox'
import LeftSidePanel from '../components/RightSidePanel'
import SizeSelection from '../components/SizeSelection'
import AddToCartButton from '../components/AddToCartButton'
import RecentView from '../components/RecentView'
import AddToCartBox from '../components/box/AddToCartBox'
import { useFavorites } from '../context/favorites'

function Favorites() {
  const navigate = useNavigate()
  const [clicked, setClicked] = useState<boolean>(false)
  const [products, setProducts] = useState<ProductSortedProps[]>([])
  const [favoriteColor, setFavorites] = useState<UserSelectionProps[]>([])
  const [productIndex, setProductIndex] = useState<number>(0)
  const [colorIndex, setColorIndex] = useState<number>(0)
  const [sizeIndex, setSizeIndex] = useState<number | null>(null)
  const [addtoCart, setAddtoCart] = useState<boolean>(false)
  const { favoritesProducts, favorites, loading } = useFavorites()

  useEffect(() => {
    setProducts(favoritesProducts)
    setFavorites(favorites)
    setProductIndex(0)
    setColorIndex(0)
  }, [favoritesProducts, favorites])

  useEffect(() => {
    if (products[productIndex]) {
      setSizeIndex(products[productIndex].size.length > 1 ? null : 0)
    }
  }, [products])

  return (
    <div className='mt-[90px] md:mt-[154px] pb-10'>
      <div className='px-4 md:px-6'>
        <h1>Favorites</h1>
        {!loading ?
          products.length === 0 ?
            <div className='justify-center flex flex-col gap-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5'>
                <div className='relative aspect-square bg-gray-100 rounded-md overflow-hidden'>
                  <img className='blur-[10px] opacity-30' src='https://qfoncqojmqdoqxleuioe.supabase.co/storage/v1/object/public/product-img//1751841317762-k5xgmm.jpg' />
                  <HeartIcon activeInit={true} classname='absolute bottom-2 right-2 animate-bounce' onClick={() => { }} />
                </div>
              </div>
              <p className='mt-4' >Tap the heart icon next to articles to save your favorites here.</p>
              <Button onClick={() => navigate('/')} classname='md:w-[200px] text-white bg-black'>Discover more</Button>
            </div>
            :
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
          : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="justify-center flex flex-col">
                  <div className="relative">
                    <div className="bg-gray-100 w-full aspect-square rounded-md overflow-hidden"></div>
                  </div>
                  <p className="mt-2 bg-gray-100 h-4 w-3/4 rounded"></p>
                  <p className="my-1 text-sm bg-gray-100 h-4 w-20 rounded"></p>
                  <div className="w-full h-12 mt-2 bg-gray-100 rounded-full"></div>
                </div>
              ))}
            </div>
          )}
      </div>

      <RecentView />

      <LeftSidePanel clicked={clicked} setClicked={setClicked}>
        {products.length > 0 && products[productIndex] &&
          <div className='flex flex-col justify-between p-4 h-[calc(100vh-50px)]'>
            <div className='grid grid-cols-[50%_50%] gap-2'>
              <div className='relative'>
                <img className='rounded-md' src={products[productIndex].images[colorIndex][0]} />
                {products[productIndex].discount !== products[productIndex].price &&
                  <p className='font-bold text-sm absolute top-1 right-1 bg-red-500 px-2 py-1 rounded-md text-white'>
                    {Math.round((products[productIndex].price - products[productIndex].discount) / products[productIndex].price * 100)}%
                  </p>
                }
              </div>
              <div>
                <p>{products[productIndex].name}</p>
                <div className='flex gap-2'>
                  <p className='font-bold'>€ {products[productIndex].discount.toFixed(2)}</p>
                  {products[productIndex].discount !== products[productIndex].price &&
                    <p className='text-gray-400 font-bold line-through'>€ {products[productIndex].price.toFixed(2)}
                    </p>
                  }
                </div>
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
