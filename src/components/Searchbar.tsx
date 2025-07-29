import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import RightSidePanel from './RightSidePanel'
import SearchIcon from '../asset/SearchIcon'
import Input from './ui/input'
import { fetchCategory } from '../utils/categoryUtils'
import { fetchProducts, sortProductData } from '../utils/productUtils'
import type { CategoryProps, ProductProps, ProductResultProps, ProductSortedProps } from '../types'
import ResultBox from './box/ResultBox'

function Searchbar() {
  const [clicked, setClicked] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)
  const [search, setSearch] = useState<string | undefined>('')
  const [products, setProducts] = useState<ProductResultProps[]>([])
  const [result, setResult] = useState<ProductResultProps[]>([])
  const [color, setColor] = useState<string>('')

  useEffect(() => {
    Promise.all([fetchCategory(), fetchProducts()])
      .then(([categoryData, productData]) => {
        const productArray: ProductResultProps[] = []

        productData.forEach((el: ProductProps) => {
          const sortedProduct: ProductSortedProps = sortProductData(el)
          const matchedCategory = categoryData.find((cat: CategoryProps) => cat.id === el.category)
          const matchedCategoryGroup = categoryData.find((cat: CategoryProps) => cat.id === matchedCategory.groupID)
          const categoryName = matchedCategory.name
          const categoryGroupName = matchedCategoryGroup.name
          const productWithCategory = {
            ...sortedProduct,
            category: categoryName,
            categoryGroup: categoryGroupName,
          }
          productArray.push(productWithCategory)
        })
        setProducts(productArray)
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err)
      })

  }, [])

  useEffect(() => {
    const keywords = search.toLowerCase().split(' ').filter(Boolean)

    if (keywords.length === 0) {
      setResult([])
      return
    }

    const matchedProducts = products.filter(product => {
      const searchableValues: string[] = []

      for (const value of Object.values(product)) {
        if (typeof value === 'string') {
          searchableValues.push(value.toLowerCase())
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            if (typeof item === 'string') {
              searchableValues.push(item.toLowerCase())
            }
          })
        }
      }

      const matchedAll = keywords.every(keyword =>
        searchableValues.some(value => value.includes(keyword))
      )

      if (matchedAll) {
        const colorMatch = product.color?.find(c =>
          keywords.includes(c.toLowerCase())
        )
        setColor(colorMatch ?? '')
      }

      return matchedAll
    })

    setResult(matchedProducts)
  }, [search, products])


  return (
    <>
      <div>
        <SearchIcon onClick={() => setClicked(true)} className='cursor-pointer' onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)} active={active} />

        <RightSidePanel clicked={clicked} setClicked={setClicked}>
          <div className='flex flex-col gap-4 p-6'>
            <Input setInputVal={setSearch} placeholder='Search...' xmark={true}>
              <Search className='w-5 mx-2' />
            </Input>

            <div className='p-1 flex flex-col gap-2'>
              {result.map((el, i) => (
                <ResultBox key={i} product={el} color={color} setClicked={setClicked} />
              ))}
            </div>
          </div>
        </RightSidePanel>
      </div>
    </>
  )
}

export default Searchbar
