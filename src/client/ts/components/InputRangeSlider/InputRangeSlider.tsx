import * as React from 'react'
import './input-range-slider.scss'

type InputRangeSliderProps = {
  min?: number
  max?: number
  value: number
  step?: number
  onChange: any
  showValue?: boolean
  width?: number
  id?: string
}

function InputRangeSlider(props: InputRangeSliderProps): JSX.Element {
  return (
    <div className="input-range-slider">
      {props.showValue && <span>{props.value}</span>}
      <input
        id={props.id}
        type="range"
        defaultValue={props.value}
        min={props.min | 0}
        max={props.max | 10}
        className="slider"
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => props.onChange(parseInt(e.target.value))}
        step={props.step | 1}
        style={{
          width: (props.width || 150) + 'px'
        }}
      />
    </div>
  )
}

export default InputRangeSlider
