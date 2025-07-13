import { useState, useEffect } from 'react'
import { fetchCategory } from '../utils/categoryUtils'
import type { CategoryProps } from '../types'

function CategoryImg({
  categoryID, navWidth, mobile
}: {
  categoryID: number,
  navWidth: number | null,
  mobile?: boolean
}) {
  const [categories, setCategories] = useState<CategoryProps[]>([])
  const [category, setCategory] = useState<CategoryProps>(categories[0])

  useEffect(() => {
    fetchCategory().then((res) => {
      setCategories(res)
    })
  }, [])

  useEffect(() => {
    if (categories.length) {
      const matchedCategory = categories.find(c => c.id === categoryID)
      if (matchedCategory) {
        setCategory(matchedCategory)
      }
    }
  }, [categories, categoryID])

  return (
    <div className='z-100 h-[230px] overflow-hidden fixed left-0 bottom-0 flex items-center justify-center' style={{ width: mobile? '100%' : navWidth ?? 0 }}>
      {category && category.image !== null && <img src={category.image} alt={category.name} className="h-[230px]"/>}
    </div>
  )
}

export default CategoryImg
