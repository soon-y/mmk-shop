import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import RightSidePanel from './RightSidePanel'
import SearchIcon from '../asset/SearchIcon'
import Input from './ui/input'
import { fetchCategory } from '../utils/categoryUtils'
import { fetchProducts, grouppingStock } from '../utils/productUtils'
import type { CategoryProps, ProductProps, ProductResultProps } from '../types'
import ResultBox from './ResultBox'

function Searchbar() {
  const [clicked, setClicked] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<ProductResultProps[]>([])
  const [result, setResult] = useState<ProductResultProps[]>([])
  const [color, setColor] = useState<string>('')

  useEffect(() => {
    Promise.all([fetchCategory(), fetchProducts()])
      .then(([categoryData, productData]) => {
        const productArray: ProductResultProps[] = []

        productData.forEach((el: ProductProps) => {
          const matchedCategory = categoryData.find((cat: CategoryProps) => cat.id === el.category)
          const matchedCategoryGroup = categoryData.find((cat: CategoryProps) => cat.id === matchedCategory.groupID)
          const categoryName = matchedCategory.name
          const categoryGroupName = matchedCategoryGroup.name
          const productWithCategory = {
            ...el,
            category: categoryName,
            categoryGroup: categoryGroupName,
            stock: grouppingStock(el.stock)
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
    const keyword = search.toLowerCase()

    const matchedProducts = products.filter(product => {
      let matchFound = false

      for (const [key, value] of Object.entries(product)) {
        if (typeof value === 'string' && value.toLowerCase().includes(keyword)) {
          matchFound = true

          if (key === 'color' && typeof value === 'string') {
            const colorArray = value.toLowerCase().split('/')
            const index = colorArray.findIndex(color => color.includes(keyword.toLowerCase()))
            if (index !== -1) {
              setColor(colorArray[index])
            }
          } else {
            setColor('')
          }
          break
        }
      }

      return matchFound
    })

    if (keyword === '') {
      setResult([])
    } else {
      setResult(matchedProducts)
    }
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
