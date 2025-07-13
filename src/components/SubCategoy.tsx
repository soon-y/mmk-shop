import { useState, useEffect } from 'react'
import { fetchCategory, sortData } from '../utils/categoryUtils'
import type { GroupedCategory } from '../types'
import { useNavigate } from 'react-router-dom'


function SubCategory({ groupID, setClicked }: { groupID: number | null, setClicked: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [categories, setCategories] = useState<GroupedCategory[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategory().then((res) => {
      setCategories(sortData(res))
    })
  }, [])

  return (
    <div className={`relative my-3`}>
      {categories.filter(group => group.id === groupID).map((item, index) => (
        item.children?.length > 0 && (
          <div key={index} className="flex flex-col  rounded z-50">
            {item.children.map((sub) => (
              <div
                key={sub.id}
                className="w-fit rounded-full px-3 py-1 hover:bg-yellow cursor-pointer whitespace-nowrap"
                onClick={() => {
                  navigate(`/shopping/product?group=${item.name.toLowerCase()}?name=${sub.name.toLowerCase()}&id=${sub.id}`)
                  setClicked(false)
                }}
              >
                {sub.name}
              </div>
            ))}
          </div>
        )
      ))}
    </div>
  )
}

export default SubCategory
