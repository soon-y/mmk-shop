import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { ProductProps, CategoryProps } from '../types'
import { fetchCategory } from "../utils/categoryUtils"
import { fetchProducts } from '../utils/productUtils'
import Filter from '../components/filter'
import ItemBox from '../components/ItemBox'

function Items() {
  const location = useLocation()
  const [loading, setLoading] = useState<boolean>(true)
  const [products, setProducts] = useState<ProductProps[]>([])
  const [category, setCategory] = useState<CategoryProps[]>([])
  const [urlID, setUrlID] = useState<number | null>(null)
  const [IDgroup, setIDgroup] = useState<number[] | number>([])
  const [displayProduct, setDisplayProduct] = useState<ProductProps[]>()
  const [filteredProduct, setFilteredProduct] = useState<ProductProps[]>()
  const [filterColor, setFilterColor] = useState<string[]>([])
  const [filterSize, setFilterSize] = useState<string[]>([])
  const [filterPriceRange, setFilterPriceRange] = useState<[number, number]>([0, 0])

  useEffect(() => {
    const useQuery = () => new URLSearchParams(location.search)
    const query = useQuery()
    const id = query.get('id')
    setUrlID(Number(id))
  }, [location])

  useEffect(() => {
    Promise.all([fetchCategory(), fetchProducts()])
      .then(([categoryData, productData]) => {
        setCategory(categoryData)
        setProducts(productData)
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (category && urlID) {
      const groupID = category.filter(item => item.groupID === urlID).map(item => item.id)

      if (groupID.length === 0) {
        setIDgroup(Number(urlID))
      } else {
        setIDgroup(groupID)
      }
    }
  }, [category, urlID])

  useEffect(() => {
    if (products && IDgroup) {
      if (Array.isArray(IDgroup)) {
        const filtered = products.filter(product => IDgroup.includes(product.category))
        setDisplayProduct(filtered)
      } else {
        const filtered = products.filter(product => IDgroup === (product.category))
        setDisplayProduct(filtered)
      }
    }
    setFilterColor([])
    setFilterSize([])
  }, [products, IDgroup])

  useEffect(() => {
    if (displayProduct) {
      const filtered = displayProduct.filter(product => {
        const matchesColor =
          filterColor.length === 0 ||
          filterColor.some(color => product.colorHex.includes(color))

        const matchesSize =
          filterSize.length === 0 ||
          filterSize.some(size => product.size.includes(size))

        const matchesPrice =
          product.price >= filterPriceRange[0] &&
          product.price <= filterPriceRange[1]

        return matchesColor && matchesSize && matchesPrice
      })

      setFilteredProduct(filtered)
    }
  }, [filterColor, filterSize, filterPriceRange])

  return (
    <div className="container px-4 md:px-6 pb-10">
      <div className='flex flex-row justify-between items-center mb-2'>
        {
          !loading ?
            (Array.isArray(IDgroup)) ?
              <div className='w-1 h-8'></div> :
              <div className='text-2xl font-bold'>
                {category.find(item => item.id === urlID)?.name}
              </div>
            :
            <div className='w-1 h-8'></div>
        }

        {displayProduct &&
          <Filter
            products={displayProduct}
            filterColor={filterColor} setFilterColor={setFilterColor}
            filterSize={filterSize} setFilterSize={setFilterSize}
            filterPriceRange={filterPriceRange} setFilterPriceRange={setFilterPriceRange}
            result={filteredProduct ? filteredProduct.length : 0}
          />
        }
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5'>
        {filteredProduct && filteredProduct.length > 0 &&
          filteredProduct.map((product) => (
            <ItemBox product={product} key={product.id} />
          ))
        }

        {loading &&
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className='animate-pulse flex flex-col gap-2'>
              <div className='bg-gray-100 w-full aspect-square rounded-md'></div>
              <div className='bg-gray-100 w-24 h-3 rounded-sm'></div>
              <div className='bg-gray-100 w-6 h-3 rounded-sm'></div>
              <div className='bg-gray-100 w-12 h-3 rounded-sm'></div>
              <div className='flex gap-2'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className='bg-gray-100 w-5 aspect-square rounded-full border-2'></span>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Items