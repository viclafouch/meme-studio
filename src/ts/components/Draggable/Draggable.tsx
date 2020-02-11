import * as React from 'react'
import { useState, useLayoutEffect, useCallback, useRef, useMemo, RefObject, useEffect } from 'react'
import { ReactSVG } from 'react-svg'
import { DrawProperties, typeString, UseEditorInt } from '@shared/validators'
import TextBox from '@shared/models/TextBox'
import { radToDegree, degreeToRad } from '@utils/index'
import { useEditor } from '@shared/hooks'
import { CUSTOM_TEXT } from '@store/reducer/constants'
import { toHistoryType } from '@utils/helpers'
import './draggable.scss'

type DraggableProps = {
  position: {
    x: number
    y: number
  }
  className?: string
  children?: React.ReactNode
  height: number
  width: number
  rotate: number
  drawProperties: DrawProperties
  id: string
  onClick?: Function
  active?: boolean
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

export function Draggable(props: DraggableProps): JSX.Element {
  const draggableRef: RefObject<HTMLDivElement> = useRef(null)
  const [{ showTextAreas, texts, saveToEditor }]: [UseEditorInt, Function] = useEditor()
  const [resizing, setResizing]: [ResizingInt, Function] = useState<ResizingInt | null>(null)
  const [rotating, setRotating]: [RotatingInt, Function] = useState<RotatingInt | null>(null)
  const [positioning, setPositioning]: [PositionInt, Function] = useState<PositionInt>(() => ({
    left: props.position.x - props.width / 2,
    top: props.position.y - props.height / 2,
    startX: null,
    startY: null,
    isDragging: false
  }))

  useEffect(() => {
    setPositioning({
      left: props.position.x - props.width / 2,
      top: props.position.y - props.height / 2,
      startX: null,
      startY: null,
      isDragging: false
    })
  }, [props.drawProperties.scale, props.id])

  const minimalSize: number = useMemo(() => props.drawProperties.scale * 40, [props.drawProperties.scale])

  const handleMouseMove = useCallback(
    ({ pageY, pageX }: MouseEvent): void => {
      if (positioning.isDragging || resizing || rotating) {
        const { drawProperties, id } = props
        const text: any = { ...texts.find((t: TextBox) => t.id === id) }
        let { top, left } = positioning
        let { centerX, centerY, height, width, rotate } = text
        if (positioning.isDragging) {
          top = pageY - positioning.startY
          left = pageX - positioning.startX
          if (top < 0) top = 0
          else if (top + height >= drawProperties.height) top = drawProperties.height - height
          if (left < 0) left = 0
          else if (left + width >= drawProperties.width) left = drawProperties.width - width
          centerY = top + height / 2
          centerX = left + width / 2
        } else if (resizing) {
          // bottom
          if (resizing.side === 'sw' || resizing.side === 'se') {
            if (resizing.height + (pageY - resizing.mouseY) > minimalSize) {
              height = resizing.height + (pageY - resizing.mouseY)
              if (top + height >= drawProperties.height) height = drawProperties.height - top
            } else height = minimalSize
            centerY = top + height / 2
          }
          // top
          else if (resizing.side === 'nw' || resizing.side === 'ne') {
            if (resizing.height - (pageY - resizing.mouseY) > minimalSize) {
              top = resizing.top + (pageY - resizing.mouseY)
              if (top < 0) top = 0
              else height = resizing.height - (pageY - resizing.mouseY)
            } else height = minimalSize
            centerY = top + height / 2
          }
          // right
          if (resizing.side === 'ne' || resizing.side === 'se') {
            if (resizing.width + (pageX - resizing.mouseX) > minimalSize) {
              width = resizing.width + (pageX - resizing.mouseX)
              if (left + width >= drawProperties.width) width = drawProperties.width - left
            } else width = minimalSize
            centerX = left + width / 2
          }
          // left
          else if (resizing.side === 'nw' || resizing.side === 'sw') {
            if (resizing.width - (pageX - resizing.mouseX) > minimalSize) {
              left = resizing.left + (pageX - resizing.mouseX)
              if (left <= 0) left = 0
              else width = resizing.width - (pageX - resizing.mouseX)
            } else width = minimalSize
            centerX = left + width / 2
          }
        } else if (rotating) {
          if (rotating.startOffsetLeft !== pageX && rotating.startOffsetTop !== pageY) {
            let radian = Math.atan2(pageY - rotating.startOffsetTop, pageX - rotating.startOffsetLeft)
            radian -= Math.atan2(rotating.startEventY - rotating.startOffsetTop, rotating.startEventX - rotating.startOffsetLeft)
            radian += rotating.lastAngle
            const degree = radToDegree(radian)
            rotate = degree
          }
        }
        const type: typeString = positioning.isDragging ? 'move' : resizing ? 'resize' : 'rotate'
        text.centerX = centerX
        text.centerY = centerY
        text.width = width
        text.height = height
        text.rotate = rotate
        saveToEditor({ type: CUSTOM_TEXT, text, historyType: toHistoryType(type) })
        setPositioning({ ...positioning, top, left })
      }
    },
    [props.drawProperties, resizing, rotating, minimalSize, positioning]
  )

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      const type = (event.currentTarget as HTMLElement).getAttribute('data-type')
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
          startOffsetLeft: left + props.width / 2,
          startOffsetTop: top + props.height / 2,
          lastAngle: degreeToRad(props.rotate),
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
          height: props.height,
          width: props.width,
          top: positioning.top,
          left: positioning.left
        })
      }
    },
    [positioning.left, positioning.top, props.height, props.width, props.rotate]
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
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return (): void => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove])

  return (
    <div
      aria-grabbed={positioning.isDragging}
      draggable={true}
      ref={draggableRef}
      data-type="drag"
      className={`draggable ${props.className || ''} ${props.active ? 'draggable-active' : ''}`}
      style={{
        left: positioning.left,
        top: positioning.top,
        height: props.height,
        width: props.width,
        transform: `rotate(${props.rotate}deg)`,
        ...(!showTextAreas ? { display: 'none' } : null)
      }}
      onMouseDown={handleMouseDown}
      onClick={(): void => props.onClick && props.onClick()}
    >
      <div className="draggable-resize" data-type="resize" data-side="ne" onMouseDown={handleMouseDown} />
      <div className="draggable-resize" data-type="resize" data-side="nw" onMouseDown={handleMouseDown} />
      <div className="draggable-resize" data-type="resize" data-side="se" onMouseDown={handleMouseDown} />
      <div className="draggable-resize" data-type="resize" data-side="sw" onMouseDown={handleMouseDown} />
      <div className="draggable-rotate" data-type="rotate" onMouseDown={handleMouseDown}>
        <ReactSVG src="images/rotation.svg" wrapper="span" className="wrapper-rotate-svg" />
      </div>
      {props.children}
    </div>
  )
}

export default Draggable
