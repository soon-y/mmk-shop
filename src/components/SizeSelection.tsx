import type { ProductProps } from '../types'

function SizeSelection({ product, colorID, stock, sizeID, setSizeID }: {
  product: ProductProps
  colorID: number
  stock: number[][]
  sizeID: number | null
  setSizeID: React.Dispatch<React.SetStateAction<number | null>>
}) {

  if (!product) return

  return (
    <div className='mb-4'>
      <div className='flex justify-between'>
        <p className='mb-1'>
          {sizeID === null ? 'Choose Size' : 'Selected Size: ' + product.size.split('/')[sizeID]}
        </p>
        {(sizeID !== null && stock[sizeID][colorID] < 10 && stock[sizeID][colorID] > 0) &&
          <p>Only {stock[sizeID][colorID]} left</p>
        }
      </div>
      <div className='flex w-full cursor-pointer'>
        {product.size.split('/').map((size: string, i: number) => (
          <div
            key={i}
            onClick={() => setSizeID(i)} className={
              `flex items-center justify-center h-12 border relative w-[25%]
                ${sizeID !== null && i === sizeID ? 'border-black border-2' : ''}
                ${stock[i][colorID] === 0 ? 'line-through text-gray-300' : ''}
              `}
          >
            {size}
            {(stock[i][colorID] < 10 && stock[i][colorID] > 0) &&
              <div className='w-[6px] aspect-square bg-magenta absolute top-1 right-1'></div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default SizeSelection