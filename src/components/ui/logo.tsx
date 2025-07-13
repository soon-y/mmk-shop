import { useNavigate } from 'react-router-dom'

const Logo = ({classname} : {classname?: string}) => {
  const navigate = useNavigate()

  return (
    <div>
      <img src='/mmk-logo.png' className={`cursor-pointer w-32 md:w-40 relative ${classname}`} onClick={() => {
            navigate(`/`)
      }} />
    </div>
  )
}

export default Logo