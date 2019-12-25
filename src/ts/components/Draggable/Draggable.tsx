import * as React from 'react'
import { useState, useLayoutEffect, useCallback, useRef } from 'react'
import { CanvasProperties } from '@shared/validators'
import TextBox from '@shared/models/TextBox'
import './draggable.scss'
import { radToDegree, degreeToRad } from '@utils/index'
import { ReactSVG } from 'react-svg'

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
  onMove: Function
  canvasProperties: CanvasProperties
  id: string
}

export function Draggable(props: DraggableProps): JSX.Element {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const rotateRef = useRef<HTMLDivElement>(null)
  const [resizing, setResizing] = useState<any>(null)
  const [rotating, setRotating] = useState<any>(null)
  const [position, setPosition] = useState({
    left: props.position.x - props.width / 2,
    top: props.position.y - props.height / 2,
    startX: null,
    startY: null
  })

  const handleMouseMove = useCallback(
    ({ clientX, clientY, pageY, pageX }: MouseEvent): void => {
      if (isDragging || resizing || rotating) {
        const { canvasProperties, id, onMove } = props
        const textsUpdated = [...canvasProperties.texts] as Array<TextBox>
        const textIndex = textsUpdated.findIndex((t: TextBox) => t.id === id)
        let { top, left } = position
        let { centerX, centerY, height, width, transform } = textsUpdated[textIndex]
        if (isDragging) {
          top = clientY - position.startY
          left = clientX - position.startX
          if (top < 0) top = 0
          else if (top + height >= canvasProperties.height) top = canvasProperties.height - height
          if (left < 0) left = 0
          else if (left + width >= canvasProperties.width) left = canvasProperties.width - width
          centerY = top + height / 2
          centerX = left + width / 2
        } else if (resizing) {
          if (resizing.side === 'sw' || resizing.side === 'se') {
            height = resizing.height + (pageY - resizing.mouseY)
            if (top + height > canvasProperties.height) height = canvasProperties.height - top
            centerY = position.top + height / 2
          } else if (resizing.side === 'nw' || resizing.side === 'ne') {
            top = resizing.top + (pageY - resizing.mouseY)
            if (top < 0) top = 0
            else height = resizing.height - (pageY - resizing.mouseY)
            centerY = position.top + height / 2
          }
          if (resizing.side === 'ne' || resizing.side === 'se') {
            width = resizing.width + (pageX - resizing.mouseX)
            if (left + width > canvasProperties.width) width = canvasProperties.width - left
            centerX = position.left + width / 2
          } else if (resizing.side === 'nw' || resizing.side === 'sw') {
            left = resizing.left + (pageX - resizing.mouseX)
            if (left <= 0) left = 0
            else width = resizing.width - (pageX - resizing.mouseX)
            centerX = position.left + width / 2
          }
        } else if (rotating) {
          if (rotating.startOffsetLeft !== pageX && rotating.startOffsetTop !== pageY) {
            let rad = Math.atan2(pageY - rotating.startOffsetTop, pageX - rotating.startOffsetLeft)
            rad -= Math.atan2(rotating.startEventY - rotating.startOffsetTop, rotating.startEventX - rotating.startOffsetLeft)
            rad += rotating.lastAngle
            const degree = radToDegree(rad)
            transform = degree
          }
        }
        textsUpdated[textIndex].centerX = centerX
        textsUpdated[textIndex].centerY = centerY
        textsUpdated[textIndex].width = width
        textsUpdated[textIndex].height = height
        textsUpdated[textIndex].transform = transform
        onMove(textsUpdated)
        setPosition({
          ...position,
          top,
          left
        })
      }
    },
    [isDragging, props, resizing, rotating]
  )

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      setPosition({
        ...position,
        startX: event.pageX - position.left,
        startY: event.clientY - position.top
      })
      setIsDragging(true)
    },
    [position.left, position.top]
  )

  const handleResizeDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      const side = (event.target as HTMLDivElement).getAttribute('data-side')
      setResizing({
        side,
        mouseX: event.pageX,
        mouseY: event.pageY,
        height: props.height,
        width: props.width,
        top: position.top,
        left: position.left
      })
    },
    [position.top, position.left, props.height, props.width]
  )

  const handleRotateDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      const { left, top } = rotateRef.current.getBoundingClientRect()
      setRotating({
        startOffsetLeft: left + props.width / 2,
        startOffsetTop: top + props.height / 2,
        lastAngle: degreeToRad(props.rotate),
        startEventX: event.pageX,
        startEventY: event.pageY
      })
    },
    [props.rotate, props.width, props.height]
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging) setIsDragging(false)
    else if (resizing) setResizing(null)
    else if (rotating) setRotating(false)
  }, [isDragging, resizing, rotating])

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
      aria-grabbed={isDragging}
      draggable={true}
      ref={rotateRef}
      className={`Draggable ${props.className || ''}`}
      style={{
        left: position.left,
        top: position.top,
        height: props.height,
        width: props.width,
        transform: `rotate(${props.rotate}deg)`
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="draggable-resize" data-side="ne" onMouseDown={handleResizeDown} />
      <div className="draggable-resize" data-side="nw" onMouseDown={handleResizeDown} />
      <div className="draggable-resize" data-side="se" onMouseDown={handleResizeDown} />
      <div className="draggable-resize" data-side="sw" onMouseDown={handleResizeDown} />
      <div className="draggable-rotate" onMouseDown={handleRotateDown}>
        <ReactSVG src="images/rotation.svg" wrapper="span" className="wrapper-rotate-svg" />
      </div>
      {props.children}
    </div>
  )
}

export default Draggable
