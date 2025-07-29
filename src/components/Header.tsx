import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Searchbar from './Searchbar'
import LeftSidePanel from './LeftSidePanel'
import RightSidePanel from './RightSidePanel'
import SubCategory from './category/SubCategoy'
import Navigation from './category/Navigation'
import CategoryImg from './category/CategoryImg'
import { useWindowSize } from '../utils/window'
import HeartIcon from '../asset/HeartIcon'
import UserIcon from '../asset/UserIcon'
import CartIcon from '../asset/CartIcon'
import MenuIcon from '../asset/MenuIcon'
import { fetchCategory } from '../utils/categoryUtils'
import type { CategoryProps } from '../types'
import Logo from './ui/logo'
import { useNavigate } from 'react-router-dom'
import LoginPopup from './LoginPopup'
import { useLocation } from 'react-router-dom'

function Header() {
  const [category, setCategory] = useState<CategoryProps[]>([])
  const [activeMenu, setActiveMenu] = useState<boolean>(false)
  const [activeUser, setActiveUser] = useState<boolean>(false)
  const [activeCart, setActiveCart] = useState<boolean>(false)
  const [activeHeart, setActiveHeart] = useState<boolean>(false)
  const [clicked, setClicked] = useState<boolean>(false)
  const [openLogin, setOpenLogin] = useState<boolean>(false)
  const [groupID, setGroupID] = useState<number | null>(null)
  const [navWidth, setNavWidth] = useState<number | null>(null)
  const [categoryID, setCategoryID] = useState<number>(0)
  const { windowWidth } = useWindowSize()
  const navigate = useNavigate()
  const pathname = useLocation().pathname

  useEffect(() => {
    if (clicked === false && windowWidth > 767) {
      setGroupID(null)
    }
  }, [clicked])

  useEffect(() => {
    fetchCategory().then((res) => {
      setCategory(res)
    })
  }, [])

  return (
    <>
      {!pathname.includes('checkout') &&
        <div id='header' className={`p-4 md:p-6 md:pb-4 z-[100] fixed top-0 w-full bg-white `}>
        <RightSidePanel groupID={groupID!!} groupName={category.find((el) => el.id === groupID)?.name} clicked={clicked} setClicked={setClicked} classname='md:hidden' >
          <div className='p-4 h-full'>
            <Navigation setGroupID={setGroupID} groupID={groupID} setClicked={setClicked} mobile={true} setCategoryID={setCategoryID} />
            <div className='relative overflow-y-auto h-[calc(100%-300px)]'>
              <SubCategory groupID={groupID} setClicked={setClicked} />
            </div>

            <CategoryImg categoryID={categoryID} navWidth={navWidth} mobile={true} />
          </div>
        </RightSidePanel>

        <div className='flex justify-between items-center inset-0 z-[100] relative'>
          <Logo />
          {!groupID && <div className='flex gap-4 md:gap-6'>
            <Searchbar />
            <UserIcon className='cursor-pointer' onMouseEnter={() => setActiveUser(true)} onMouseLeave={() => setActiveUser(false)} active={activeUser} setClicked={setOpenLogin} />
            <HeartIcon onClick={() => navigate('/favorites')} onMouseEnter={() => setActiveHeart(true)} onMouseLeave={() => setActiveHeart(false)} activeInit={activeHeart} />
            <CartIcon className='cursor-pointer' onMouseEnter={() => setActiveCart(true)} onMouseLeave={() => setActiveCart(false)} active={activeCart} />
            {!clicked ?
              <MenuIcon className='cursor-pointer md:hidden' onMouseEnter={() => setActiveMenu(true)} onMouseLeave={() => setActiveMenu(false)} active={activeMenu}
                onClick={() => {
                  setClicked(true)
                  setActiveMenu(false)
                }} /> :
              <X className='button md:hidden' onClick={() => setClicked(false)} />
            }
          </div>}
        </div>

        <div className="hidden group z-50 md:inline-block" onMouseLeave={() => { if (windowWidth > 767) setGroupID(null) }}>
          <Navigation setGroupID={setGroupID} groupID={groupID} setClicked={setClicked} setNavWidth={setNavWidth} setCategoryID={setCategoryID} />

          <LeftSidePanel width={navWidth}>
            <div className='px-6'>
              <SubCategory groupID={groupID} setClicked={setClicked} />
            </div>

            <CategoryImg categoryID={categoryID} navWidth={navWidth} />
          </LeftSidePanel>
        </div>
      </div>
      }

      {openLogin && <LoginPopup setClicked={setOpenLogin} />}
    </>
  )
}

export default Header
