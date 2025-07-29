import { type ReactNode } from "react"
import { useAuth } from '../../context/auth'

interface Props {
  value?: string
  item: ReactNode
  info?: {id: string, index: number, target: string, select: boolean | null}
}

function RadioButtons({ options, selectedOption, setSelectedOption, editable, setEditable }: {
  options: Props[],
  selectedOption: number | null,
  editable?: boolean,
  setEditable?: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedOption: React.Dispatch<React.SetStateAction<number | null>>
}) {
  const { deleteAddr } = useAuth()

  return (
    <form>
      {options.map((el, i) => (
        <div key={i}>
          <label className="flex gap-4 my-2 items-start">
            <input
            className="mt-3"
              type="radio"
              name={el.value ? el.value : 'address'}
              value={i}
              checked={selectedOption === i}
              onChange={(e) => setSelectedOption(Number(e.target.value))}
            />
            <div className="w-full">{el.item}</div>
            {/* {el.value && <p className="font-semibold">{el.value}</p>} */}
          </label>
          {editable &&
            <div className="ml-7 flex gap-4 mb-4 cursor-pointer">
              <p className="underline" onClick={() => {
                setEditable?.(true)
                setSelectedOption(i)
                }}>Edit</p>
              {options.length > 1 && el.info!.select !== true && <p className="underline" onClick={() => {
                deleteAddr(el.info!.id, el.info!.index, el.info!.target)
              }}>Delete</p>}
            </div>
          }
        </div>
      ))}
    </form>
  )
}

export default RadioButtons
