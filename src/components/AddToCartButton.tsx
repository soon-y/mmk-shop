import { removeFavorite, saveCart } from '../utils/cookieUtils'
import Button from './ui/button'
import { useNavigate } from 'react-router-dom'

function AddButton({ id, sizeID, colorID, stock, setClicked }: {
  id: number
  sizeID: number | null,
  colorID: number,
  stock: number[][]
  setClicked?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const navigate = useNavigate()
  const addtoCart = () => {
    saveCart(id + '/' + sizeID + '/' + colorID +'-1')
    removeFavorite(id + '/' + colorID)
    if (setClicked) setClicked(false)
    navigate('/cart')
  }

  return (
    <Button onClick={addtoCart} disabled={(sizeID === null) || (sizeID !== null && stock[sizeID][colorID] === 0)}>
      {(sizeID !== null && stock[sizeID][colorID] === 0) ? 'Out of Stock' : 'Add'}
    </Button>
  )
}

export default AddButton