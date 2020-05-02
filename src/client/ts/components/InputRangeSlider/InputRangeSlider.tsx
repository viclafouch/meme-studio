import * as React from 'react'
import './input-range-slider.scss'

interface InputRangeSliderProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  showValue?: boolean
  width?: number
}

function InputRangeSlider({ width, showValue, value, ...rest }: InputRangeSliderProps): JSX.Element {
  return (
    <div className="input-range-slider">
      {showValue && <span>{value}</span>}
      <input
        type="range"
        defaultValue={value}
        className="slider"
        style={{
          width: (width || 150) + 'px'
        }}
        {...rest}
      />
    </div>
  )
}

export default InputRangeSlider
