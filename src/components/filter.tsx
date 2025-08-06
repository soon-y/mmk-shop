import { useState, useEffect, type ReactNode } from 'react'
import { ListFilter } from 'lucide-react'
import LeftSidePanel from './RightSidePanel'
import type { ProductSortedProps } from '../types'
import DualRangeSlider from './ui/dualRangeSlider'
import Button from './ui/button'
import MMKColor from '../asset/mmkColor'

export default function Filter({ products, filterColor, filterSize, filterPriceRange, result, setFilterColor, setFilterSize, setFilterPriceRange }: {
  products: ProductSortedProps[]
  filterColor: string[]
  filterSize: string[]
  filterPriceRange: number[]
  setFilterColor: React.Dispatch<React.SetStateAction<string[]>>
  setFilterSize: React.Dispatch<React.SetStateAction<string[]>>
  setFilterPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>
  result: number
}) {
  const [clicked, setClicked] = useState<boolean>(false)
  const [priceRange, setPriceRange] = useState<number[]>([])
  const [colorArr, setColorArr] = useState<string[]>([])
  const [sizeArr, setSizeArr] = useState<string[]>([])

  useEffect(() => {
    if (products) {
      const colorSet = new Set<string>()
      const sizeSet = new Set<string>()
      const prices: number[] = []
      for (const item of products) {
        item.colorHex.forEach(color => colorSet.add(color))
        item.size.forEach(size => sizeSet.add(size))
        prices.push(item.price)
      }

      setColorArr(Array.from(colorSet))
      setSizeArr(Array.from(sizeSet))
      setPriceRange([Math.min(...prices), Math.max(...prices)])
    }
  }, [products])

  return (
    <>
      <div>
        <div className='cursor-pointer flex gap-2 items-center' onClick={() => setClicked(true)}>
          <span className='text-sm'>FILTER</span>
          <ListFilter className='button' />
        </div>

        <LeftSidePanel clicked={clicked} setClicked={setClicked} classname=''>
          <div className='relative flex flex-col gap-12 p-6 overflow-y-auto w-full max-h-[calc(100vh-130px)]'>

            <DualRangeSlider min={priceRange[0]} max={priceRange[1]} range={filterPriceRange} setRange={setFilterPriceRange} />

            <div>
              <Title name='Color' reset={setFilterColor} />
              <div className='flex flex-wrap gap-2'>
                {colorArr.map((color, i) => (
                  <Selection key={i} array={filterColor} setArray={setFilterColor} value={color}>
                    {color.includes('#')?
                      <div className='w-6 aspect-square' style={{ background: color }}></div>:
                      <div className='w-6 aspect-square overflow-hidden'>
                        <MMKColor className='w-10 h-10'/>
                      </div>
                    }
                  </Selection>
                ))}
              </div>
            </div>

            <div>
              <Title name='Size' reset={setFilterSize} />
              <div className='flex flex-wrap gap-2'>
                {sizeArr.map((size, i) => (
                  <Selection key={i} array={filterSize} setArray={setFilterSize} value={size}>
                    <div key={i} className='border py-1 px-2'>{size}</div>
                  </Selection>
                ))}
              </div>
            </div>
          </div>

          <div className='absolute left-0 bottom-0 w-full p-6'>
            <Button onClick={() => setClicked(false)}>
              Show [{result}]
            </Button>
          </div>
        </LeftSidePanel>
      </div>
    </>
  )
}

const Title = ({ name, reset }: { name: string, reset: React.Dispatch<React.SetStateAction<string[]>> }) => {
  return (
    <div className='flex justify-between items-center'>
      <div className='uppercase my-1 text-sm font-semibold'>{name}</div>
      <p className='cursor-pointer text-gray-400 underline text-sm' onClick={() => reset([])}>reset</p>
    </div>
  )
}

const Selection = ({ children, value, array, setArray }: { value: string, children: ReactNode, array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>> }) => {
  const [clicked, setClicked] = useState<boolean>(false)

  useEffect(() => {
    if (array && array.length === 0) {
      setClicked(false)
    }
  }, [array])

  return (
    <div className={`border-2 cursor-pointer ${clicked ? 'border-black' : 'border-gray-200'}`} onClick={() => {
      setClicked((state) => (!state))
      setArray((prev: string[]) => clicked ? prev.filter(v => v !== value) : [...prev, value])
    }} >
      {children}
    </div>
  )
}
