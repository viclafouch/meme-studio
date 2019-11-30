import * as React from 'react'

type InputRangeSliderProps = {
  min?: number
  max?: number
  value: number
  step?: number
  onChange: any
}

function InputRangeSlider(props: InputRangeSliderProps): JSX.Element {
  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }} className="Input-range-slider">
      <span style={{ fontSize: '16px', marginBottom: '6px' }}>{props.value}</span>
      <input
        type="range"
        defaultValue={props.value}
        min={props.min | 0}
        max={props.max | 10}
        className="slider"
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => props.onChange(e.target.value)}
        step={props.step | 1}
      />
    </div>
  )
}

export default InputRangeSlider
