import type { ProductSortedProps } from '../types'

function SizeSelection({ product, colorIndex, sizeIndex, setSizeIndex }: {
  product: ProductSortedProps
  colorIndex: number
  sizeIndex: number | null
  setSizeIndex: React.Dispatch<React.SetStateAction<number | null>>
}) {

  if (!product) return

  return (
    <div className='mb-4'>
      <div className='flex justify-between'>
        <p className='mb-1'>
          {sizeIndex === null ? 'Choose Size' : 'Selected Size: ' + product.size[sizeIndex]}
        </p>
        {(sizeIndex !== null && product.stock[sizeIndex][colorIndex] < 10 && product.stock[sizeIndex][colorIndex] > 0) &&
          <p>Only {product.stock[sizeIndex][colorIndex]} left</p>
        }
      </div>
      <div className='flex w-full cursor-pointer'>
        {product.size.map((size: string, i: number) => (
          <div
            key={i}
            onClick={() => setSizeIndex(i)} className={
              `flex items-center justify-center h-12 border relative w-[25%]
                ${sizeIndex !== null && i === sizeIndex ? 'border-black border-2' : ''}
                ${product.stock[i][colorIndex] === 0 ? 'line-through text-gray-300' : ''}
              `}
          >
            {size}
            {(product.stock[i][colorIndex] < 10 && product.stock[i][colorIndex] > 0) &&
              <div className='w-[6px] aspect-square bg-magenta absolute top-1 right-1'></div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default SizeSelection