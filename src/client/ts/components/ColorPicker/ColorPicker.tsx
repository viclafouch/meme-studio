import * as React from 'react'
import { useState, useImperativeHandle } from 'react'
import { ChromePicker, ColorResult } from 'react-color'
import './color-picker.scss'

type ColorPickerProps = {
  color: string
  setColor: (color: ColorResult) => void
}

const ColorPicker = React.forwardRef((props: ColorPickerProps, ref: any) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleClick = (): void => setIsOpen(!isOpen)

  const handleClose = (): void => setIsOpen(false)

  useImperativeHandle(ref, () => ({
    open: handleClick
  }))

  return (
    <div className="color-picker">
      <button
        arial-label="color"
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
})

export default ColorPicker
