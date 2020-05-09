import * as React from 'react'
import { useState, useLayoutEffect, useCallback, useRef, useMemo, RefObject, useEffect, memo } from 'react'
import { ReactSVG } from 'react-svg'
import { DrawProperties, typeString } from '@client/ts/shared/validators'
import TextBox from '@client/ts/shared/models/TextBox'
import { radToDegree, degreeToRad } from '@client/utils/index'
import { CUSTOM_TEXT } from '@client/store/reducer/constants'
import { toHistoryType } from '@client/utils/helpers'
import './draggable.scss'
import Meme from '@client/ts/shared/models/Meme'

const isKeyArrow = (keyCode: number): string | false => {
  if (keyCode === 38) return 'up'
  else if (keyCode === 39) return 'right'
  else if (keyCode === 40) return 'down'
  else if (keyCode === 37) return 'left'
  return false
}

type DraggableProps = {
  drawProperties: DrawProperties
  isSelected: boolean
  memeSelected: Meme
  zIndex: number
  text: TextBox
  saveToEditor: Function
}

interface ResizingInt {
  side: 'ne' | 'se' | 'sw' | 'nw'
  mouseX: number
  mouseY: number
  height: number
  width: number
  top: number
  left: number
}

interface PositionInt {
  left: number
  top: number
  startX: number
  startY: number
  isDragging: boolean
}

interface RotatingInt {
  startOffsetLeft: number
  startOffsetTop: number
  lastAngle: number
  startEventX: number
  startEventY: number
}

const initialPosition = (text: TextBox): PositionInt => ({
  left: text.centerX - text.width / 2,
  top: text.centerY - text.height / 2,
  startX: null,
  startY: null,
  isDragging: false
})

export function Draggable(props: DraggableProps): JSX.Element {
  const draggableRef: RefObject<HTMLDivElement> = useRef(null)
  const [resizing, setResizing]: [ResizingInt, Function] = useState<ResizingInt | null>(null)
  const [rotating, setRotating]: [RotatingInt, Function] = useState<RotatingInt | null>(null)
  const [positioning, setPositioning]: [PositionInt, Function] = useState<PositionInt>(() => initialPosition(props.text))

  useEffect(() => setPositioning(initialPosition(props.text)), [props.drawProperties.scale, props.text.id])

  const minimalSize: number = useMemo(() => props.drawProperties.scale * 40, [props.drawProperties.scale])

  const handleMove = useCallback(
    (event: MouseEvent | KeyboardEvent): void => {
      const {
        drawProperties,
        memeSelected,
        text: { ...text }
      } = props
      let { top, left } = positioning
      let { centerX, centerY, height, width, rotate } = text

      let type: typeString

      if (event instanceof MouseEvent) {
        if (positioning.isDragging) {
          type = 'move'
          top = event.pageY - positioning.startY
          left = event.pageX - positioning.startX
          if (top < 0) top = 0
          else if (top + height >= drawProperties.height) top = drawProperties.height - height
          if (left < 0) left = 0
          else if (left + width >= drawProperties.width) left = drawProperties.width - width
          centerY = top + height / 2
          centerX = left + width / 2
        } else if (resizing) {
          type = 'resize'
          if (resizing.side === 'sw' || resizing.side === 'se') {
            if (resizing.height + (event.pageY - resizing.mouseY) > minimalSize) {
              height = resizing.height + (event.pageY - resizing.mouseY)
              if (top + height >= drawProperties.height) height = drawProperties.height - top
            } else height = minimalSize
            centerY = top + height / 2
          } else if (resizing.side === 'nw' || resizing.side === 'ne') {
            if (resizing.height - (event.pageY - resizing.mouseY) > minimalSize) {
              top = resizing.top + (event.pageY - resizing.mouseY)
              if (top < 0) top = 0
              else height = resizing.height - (event.pageY - resizing.mouseY)
            } else height = minimalSize
            centerY = top + height / 2
          }
          if (resizing.side === 'ne' || resizing.side === 'se') {
            if (resizing.width + (event.pageX - resizing.mouseX) > minimalSize) {
              width = resizing.width + (event.pageX - resizing.mouseX)
              if (left + width >= drawProperties.width) width = drawProperties.width - left
            } else width = minimalSize
            centerX = left + width / 2
          } else if (resizing.side === 'nw' || resizing.side === 'sw') {
            if (resizing.width - (event.pageX - resizing.mouseX) > minimalSize) {
              left = resizing.left + (event.pageX - resizing.mouseX)
              if (left <= 0) left = 0
              else width = resizing.width - (event.pageX - resizing.mouseX)
            } else width = minimalSize
            centerX = left + width / 2
          }
        } else if (rotating) {
          if (rotating.startOffsetLeft !== event.pageX && rotating.startOffsetTop !== event.pageY) {
            type = 'rotate'
            let radian = Math.atan2(event.pageY - rotating.startOffsetTop, event.pageX - rotating.startOffsetLeft)
            radian -= Math.atan2(rotating.startEventY - rotating.startOffsetTop, rotating.startEventX - rotating.startOffsetLeft)
            radian += rotating.lastAngle
            const degree = radToDegree(radian)
            rotate = degree
          }
        }
      } else {
        const arrow = isKeyArrow(event.keyCode)
        if (arrow) {
          type = 'move'
          if (arrow === 'up' && top >= 1) {
            if (top > 1) top--
            else top = 0
            centerY = top + height / 2
          } else if (arrow === 'left') {
            if (left > 1) left--
            else left = 0
            centerX = left + width / 2
          } else if (arrow === 'down') {
            if (drawProperties.height - top - height > 1) top++
            else top = drawProperties.height - height
            centerY = top + height / 2
          } else if (arrow === 'right') {
            if (drawProperties.width - left - width > 1) left++
            else left = drawProperties.width - width
            centerX = left + width / 2
          }
        } else return
      }
      if (type) {
        text.centerX = centerX
        text.centerY = centerY
        text.width = width
        text.height = height
        text.rotate = rotate
        text.base = {
          centerX: (centerX / drawProperties.width) * memeSelected.width,
          centerY: (centerY / drawProperties.height) * memeSelected.height,
          width: (width / drawProperties.width) * memeSelected.width,
          height: (height / drawProperties.height) * memeSelected.height
        }
        props.saveToEditor({ type: CUSTOM_TEXT, text, historyType: toHistoryType(type) })
        setPositioning({ ...positioning, top, left })
      }
    },
    [props.drawProperties, resizing, rotating, minimalSize, positioning, props.memeSelected, props.text, props.saveToEditor]
  )

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      const type = (event.currentTarget as HTMLElement).getAttribute('data-type')
      const { width, height, rotate } = props.text
      if (type === 'drag') {
        setPositioning({
          ...positioning,
          startX: event.pageX - positioning.left,
          startY: event.pageY - positioning.top,
          isDragging: true
        })
      } else if (type === 'rotate') {
        event.stopPropagation()
        const { left, top } = draggableRef.current.getBoundingClientRect()
        setRotating({
          startOffsetLeft: left + width / 2,
          startOffsetTop: top + height / 2,
          lastAngle: degreeToRad(rotate),
          startEventX: event.pageX,
          startEventY: event.pageY
        })
      } else if (type === 'resize') {
        event.stopPropagation()
        const side = (event.target as HTMLDivElement).getAttribute('data-side')
        setResizing({
          side: side as ResizingInt['side'],
          mouseX: event.pageX,
          mouseY: event.pageY,
          height: height,
          width: width,
          top: positioning.top,
          left: positioning.left
        })
      }
    },
    [positioning.left, positioning.top, props.text]
  )

  const handleMouseUp = useCallback(() => {
    if (positioning.isDragging)
      setPositioning({
        ...positioning,
        isDragging: false
      })
    else if (resizing) setResizing(null)
    else if (rotating) setRotating(null)
  }, [positioning, resizing, rotating])

  useLayoutEffect(() => {
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleMouseUp)
    return (): void => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMove, handleMouseUp])

  useLayoutEffect(() => {
    if (props.isSelected) window.addEventListener('keydown', handleMove)
    return (): void => {
      window.removeEventListener('keydown', handleMove)
    }
  }, [handleMove, props.isSelected])

  if (props.text.id === 'pBg48UiNS') {
    console.log('render')
  }

  return (
    <div
      aria-grabbed={positioning.isDragging}
      draggable={true}
      ref={draggableRef}
      id={props.text.id}
      data-type="drag"
      className={`draggable text-box ${props.isSelected ? 'draggable-isSelected' : ''}`}
      style={{
        left: positioning.left,
        top: positioning.top,
        height: props.text.height,
        width: props.text.width,
        zIndex: props.zIndex,
        transform: `rotate(${props.text.rotate}deg)`
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="draggable-resize" data-type="resize" data-side="ne" onMouseDown={handleMouseDown} />
      <div className="draggable-resize" data-type="resize" data-side="nw" onMouseDown={handleMouseDown} />
      <div className="draggable-resize" data-type="resize" data-side="se" onMouseDown={handleMouseDown} />
      <div className="draggable-resize" data-type="resize" data-side="sw" onMouseDown={handleMouseDown} />
      <div className="draggable-rotate" data-type="rotate" onMouseDown={handleMouseDown}>
        <ReactSVG src="/images/rotation.svg" wrapper="span" className="wrapper-rotate-svg" />
      </div>
    </div>
  )
}

export default memo(Draggable)
