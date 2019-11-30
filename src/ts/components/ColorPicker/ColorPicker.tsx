import * as React from 'react'
import { useState } from 'react'
import { ChromePicker, ColorResult } from 'react-color'
import './color-picker.scss'

type ColorPickerProps = {
  color: string
  setColor: Function
}

function ColorPicker(props: ColorPickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleClick = (): void => setIsOpen(!isOpen)

  const handleClose = (): void => setIsOpen(false)

  return (
    <div className="Color-picker">
      <button
        className="color-picker-button"
        style={{
          backgroundColor: props.color
        }}
        onClick={handleClick}
      ></button>
      {isOpen && (
        <div className="color-picker-popover">
          <div className="color-picker-cover" onClick={handleClose} />
          <ChromePicker color={props.color} onChange={(color: ColorResult): void => props.setColor(color)} />
        </div>
      )}
    </div>
  )
}

export default ColorPicker
