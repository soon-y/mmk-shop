import { useState, useEffect, useRef } from 'react'
import { fetchCategory, sortData } from '../utils/categoryUtils'
import type { GroupedCategory } from '../types'
import { useNavigate, useLocation } from 'react-router-dom'
import { isTouchDevice, useWindowSize } from '../utils/window'

function Navigation({ groupID, mobile, setGroupID, setClicked, setNavWidth, setCategoryID, classname = '' }: {
  groupID?: number | null,
  mobile?: boolean,
  setGroupID?: React.Dispatch<React.SetStateAction<number | null>>,
  setCategoryID?: React.Dispatch<React.SetStateAction<number>>,
  setClicked?: React.Dispatch<React.SetStateAction<boolean>>,
  setNavWidth?: React.Dispatch<React.SetStateAction<number | null>>,
  classname?: string
}) {
  const [categories, setCategories] = useState<GroupedCategory[]>([])
  const [ID, setID] = useState<string | null>('')
  const navigate = useNavigate()
  const location = useLocation()
  const navRef = useRef<HTMLDivElement | null>(null)
  const touchDevice = isTouchDevice()
  const { windowWidth } = useWindowSize()

  useEffect(() => {
    const useQuery = () => new URLSearchParams(location.search)
    const query = useQuery()
    const id = query.get('group')
    if (id) setID(id)
    else {
      setID(null)
      setGroupID?.(null)
    }

    window.scrollTo(0, 0)
  }, [location])

  useEffect(() => {
    fetchCategory().then((res) => {
      setCategories(sortData(res))
    })
  }, [])

  useEffect(() => {
    if (navRef.current) {
      const { width } = navRef.current.getBoundingClientRect()

      if (width > 700) {
        setNavWidth?.(760)
      } else {
        setNavWidth?.(Math.round(width + 60))
      }
    }
  }, [categories, windowWidth])

  return (
    <div className={`relative w-auto z-50 inline-block mt-4 ${classname}`} ref={navRef} style={{
      maxWidth: 700,
    }}>
      <div className="flex gap-1 flex-wrap">
        {categories.map((item, index) => (
          <div key={index} className="relative group">
            <div
              onMouseOver={() => {
                if (windowWidth > 767) {
                  setCategoryID?.(item.id)
                  setGroupID?.(item.id)
                }
              }}
              onClick={() => {
                if (!mobile) {
                  navigate(`/shopping/product?group=${(item.name).toLocaleLowerCase()}&id=${item.id}`)
                  setClicked?.(false)
                  setCategoryID?.(item.id)
                  setGroupID?.(item.id)
                } else {
                  setCategoryID?.(item.id)
                  setGroupID?.(item.id)
                }
              }}
              className={`cursor-pointer inline-block transition-colors duration-400 text-center text-base px-3 py-1 rounded-full ${touchDevice || windowWidth < 768 ? '' : 'hover:bg-yellow hover:text-black'
                }
            ${groupID !== null ?
                  groupID === item.id ? 'bg-magenta text-white md:bg-yellow md:text-black' : '' :
                  ID && ID.includes(item.name.toLocaleLowerCase()) ? 'bg-magenta text-white' : ''}
          `}
            >
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Navigation
