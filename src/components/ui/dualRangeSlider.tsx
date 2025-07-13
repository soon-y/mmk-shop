import { useState, useEffect } from 'react'

function DualRangeSlider({ min, max, range, setRange }: {
  min: number,
  max: number,
  range: number[],
  setRange: React.Dispatch<React.SetStateAction<[number, number]>>
}) {
  const [priceRange, setPriceRange] = useState<number[]>([])

  useEffect(() => {
    if (min && max) {
      setPriceRange([min, max])
      setRange([min, max])
    }
  }, [min, max])

  useEffect(() => {
    if (range && range.length === 0) {
      setRange([min, max])
    }
  }, [range])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), range[1])
    setRange([newMin, range[1]])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), range[0])
    setRange([range[0], newMax])
  }

  const calcPercent = (val: number) => {
    const [min, max] = priceRange
    return ((val - min) / (max - min)) * 100
  }

  return (
    <>
    {min !== max && 
    <div>
      <div className='flex justify-between items-center'>
        <div className='uppercase my-1 text-sm font-semibold'>price range</div>
        <p className='cursor-pointer text-gray-400 underline text-sm' onClick={() => setRange([min, max])}>reset</p>
      </div>

      <div className='flex justify-between'>
        <span>€ {range[0]}</span>
        <span>€ {range[1]}</span>
      </div>
      <div className="range-slider">
        <div className="slider-track-bg" />
        <div
          className="slider-track"
          style={{
            left: `${calcPercent(range[0])}%`,
            right: `${100 - calcPercent(range[1])}%`
          }}
        />
        <input
          type="range"
          min={priceRange[0]}
          max={priceRange[1]}
          value={range[0]}
          onChange={handleMinChange}
          className="thumb thumb-left"
        />
        <input
          type="range"
          min={priceRange[0]}
          max={priceRange[1]}
          value={range[1]}
          onChange={handleMaxChange}
          className="thumb thumb-right"
        />
      </div>
    </div>
    }
    </>
  )
}

export default DualRangeSlider
