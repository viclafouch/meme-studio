import * as React from 'react'
import { useState, useLayoutEffect, useCallback, useRef, useMemo, RefObject, useEffect, memo } from 'react'
import { ReactSVG } from 'react-svg'
import { DrawProperties, typeString } from '@client/ts/shared/validators'
import TextBox from '@client/ts/shared/models/TextBox'
import { radToDegree, degreeToRad } from '@client/utils/index'
import { CUSTOM_TEXT } from '@client/store/reducer/constants'
import { toHistoryType } from '@client/utils/helpers'
import Meme from '@client/ts/shared/models/Meme'
import './draggable.scss'

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
  setTextSelected: Function
}

interface StateInt {
  isDragging: boolean
  isRotating: boolean
  isResinzing: boolean
  lastAngle: number
  lastWidth: TextBox['width']
  lastHeight: TextBox['height']
  left: number
  top: number
  side: 'ne' | 'se' | 'sw' | 'nw' | null
  downPageX: number
  downPageY: number
  downStartX: number
  downStartY: number
  startOffsetLeft: number
  startOffsetTop: number
  lastTop: number
  lastLeft: number
}

const initalState = (text: TextBox): StateInt => ({
  left: text.centerX - text.width / 2,
  top: text.centerY - text.height / 2,
  lastLeft: text.centerX - text.width / 2,
  lastTop: text.centerY - text.height / 2,
  downStartX: 0,
  downStartY: 0,
  downPageY: 0,
  downPageX: 0,
  isDragging: false,
  isRotating: false,
  isResinzing: false,
  side: null,
  lastAngle: degreeToRad(text.rotate),
  lastWidth: text.width,
  lastHeight: text.height,
  startOffsetLeft: 0,
  startOffsetTop: 0
})

export function Draggable(props: DraggableProps): JSX.Element {
  const draggableRef: RefObject<HTMLDivElement> = useRef(null)
  const [state, setState]: [StateInt, Function] = useState(() => initalState(props.text))

  useEffect(() => {
    setState(initalState(props.text))
  }, [props.drawProperties.scale, setState])

  const minimalSize: number = useMemo(() => props.drawProperties.scale * 40, [props.drawProperties.scale])

  const handleMove = useCallback(
    (event: MouseEvent | KeyboardEvent): void => {
      const {
        drawProperties,
        memeSelected,
        text: { ...text }
      } = props
      let { top, left } = state
      const { downStartX, downStartY, downPageY, downPageX } = state
      let { centerX, centerY, height, width, rotate } = text

      let type: typeString

      if (event instanceof MouseEvent) {
        if (state.isDragging) {
          type = 'move'
          top = event.pageY - downStartY
          left = event.pageX - downStartX
          if (top < 0) top = 0
          else if (top + height >= drawProperties.height) top = drawProperties.height - height
          if (left < 0) left = 0
          else if (left + width >= drawProperties.width) left = drawProperties.width - width
          centerY = top + height / 2
          centerX = left + width / 2
        } else if (state.isResinzing) {
          type = 'resize'
          if (state.side === 'sw' || state.side === 'se') {
            if (state.lastHeight + (event.pageY - downPageY) > minimalSize) {
              height = state.lastHeight + (event.pageY - downPageY)
              if (top + height >= drawProperties.height) height = drawProperties.height - top
            } else height = minimalSize
            centerY = top + height / 2
          } else if (state.side === 'nw' || state.side === 'ne') {
            if (state.lastHeight - (event.pageY - downPageY) > minimalSize) {
              top = state.lastTop + (event.pageY - downPageY)
              if (top < 0) top = 0
              else height = state.lastHeight - (event.pageY - downPageY)
            } else height = minimalSize
            centerY = top + height / 2
          }
          if (state.side === 'ne' || state.side === 'se') {
            if (state.lastWidth + (event.pageX - downPageX) > minimalSize) {
              width = state.lastWidth + (event.pageX - downPageX)
              if (left + width >= drawProperties.width) width = drawProperties.width - left
            } else width = minimalSize
            centerX = left + width / 2
          } else if (state.side === 'nw' || state.side === 'sw') {
            if (state.lastWidth - (event.pageX - downPageX) > minimalSize) {
              left = state.lastLeft + (event.pageX - downPageX)
              if (left <= 0) left = 0
              else width = state.lastWidth - (event.pageX - downPageX)
            } else width = minimalSize
            centerX = left + width / 2
          }
        } else if (state.isRotating) {
          if (state.startOffsetLeft !== event.pageX && state.startOffsetTop !== event.pageY) {
            type = 'rotate'
            let radian = Math.atan2(event.pageY - state.startOffsetTop, event.pageX - state.startOffsetLeft)
            radian -= Math.atan2(downPageY - state.startOffsetTop, downPageX - state.startOffsetLeft)
            radian += state.lastAngle
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
        setState({ ...state, top, left })
      }
    },
    [props.drawProperties, state, minimalSize, props.memeSelected, props.text, props.saveToEditor, setState]
  )

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      event.persist()
      const type = event.currentTarget.getAttribute('data-type')
      const side = event.currentTarget.getAttribute('data-side') as StateInt['side']
      const { left, top } = draggableRef.current.getBoundingClientRect()
      const { width, height, rotate } = props.text
      if (type === 'drag') {
        setState(
          (state: StateInt): StateInt => ({
            ...state,
            downStartX: event.pageX - state.left,
            downStartY: event.pageY - state.top,
            isDragging: true
          })
        )
      } else if (type === 'rotate') {
        setState(
          (state: StateInt): StateInt => ({
            ...state,
            startOffsetLeft: left + width / 2,
            startOffsetTop: top + height / 2,
            downPageX: event.pageX,
            downPageY: event.pageY,
            lastAngle: degreeToRad(rotate),
            isRotating: true
          })
        )
      } else if (type === 'resize') {
        setState(
          (state: StateInt): StateInt => ({
            ...state,
            side,
            downPageX: event.pageX,
            downPageY: event.pageY,
            lastHeight: height,
            lastWidth: width,
            lastLeft: state.left,
            lastTop: state.top,
            isResinzing: true
          })
        )
      }
    },
    [props.text, setState]
  )

  const handleMouseUp = useCallback(() => {
    if (state.isDragging || state.isRotating || state.isResinzing)
      setState(
        (state: StateInt): StateInt => ({
          ...state,
          isDragging: false,
          isResinzing: false,
          isRotating: false
        })
      )
  }, [state.isDragging, state.isResinzing, state.isRotating, setState])

  useLayoutEffect(() => {
    if (state.isRotating || state.isResinzing || state.isDragging) {
      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return (): void => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMove, handleMouseUp, state.isRotating, state.isResinzing, state.isDragging])

  useLayoutEffect(() => {
    if (props.isSelected) window.addEventListener('keydown', handleMove)
    return (): void => {
      window.removeEventListener('keydown', handleMove)
    }
  }, [handleMove, props.isSelected])

  return (
    <div
      aria-grabbed={state.isDragging}
      draggable={true}
      ref={draggableRef}
      id={props.text.id}
      data-type="drag"
      className={`draggable text-box ${props.isSelected ? 'draggable-active' : ''}`}
      style={{
        transform: `translate3d(${Math.round(state.left)}px, ${Math.round(state.top)}px, 0) rotate(${props.text.rotate}deg)`,
        height: Math.round(props.text.height),
        width: Math.round(props.text.width),
        zIndex: props.zIndex
      }}
      onMouseDown={handleMouseDown}
      onClick={(): void => !props.isSelected && props.setTextSelected(props.text.id)}
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
