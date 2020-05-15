import * as React from 'react'
import { useState, useLayoutEffect, useCallback, useRef, useMemo, RefObject, useEffect, memo } from 'react'
import { ReactSVG } from 'react-svg'
import { resize } from '../../utils/helpers'
import { DrawProperties, typeString } from '@client/ts/shared/validators'
import TextBox from '@client/ts/shared/models/TextBox'
import { radToDegree, degreeToRad } from '@client/utils/index'
import { CUSTOM_TEXT, CUSTOM_IMAGE } from '@client/store/reducer/constants'
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
  type: 'image' | 'text'
  zIndex: number
  item: any
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

const initalState = (item: DraggableProps['item']): StateInt => ({
  left: item.centerX - item.width / 2,
  top: item.centerY - item.height / 2,
  lastLeft: item.centerX - item.width / 2,
  lastTop: item.centerY - item.height / 2,
  downStartX: 0,
  downStartY: 0,
  downPageY: 0,
  downPageX: 0,
  isDragging: false,
  isRotating: false,
  isResinzing: false,
  side: null,
  lastAngle: degreeToRad(item.rotate),
  lastWidth: item.width,
  lastHeight: item.height,
  startOffsetLeft: 0,
  startOffsetTop: 0
})

export function Draggable(props: DraggableProps): JSX.Element {
  const draggableRef: RefObject<HTMLDivElement> = useRef(null)
  const [state, setState]: [StateInt, Function] = useState(() => initalState(props.item))

  useEffect(() => {
    setState(initalState(props.item))
  }, [props.drawProperties.scale, setState])

  const minimalSize: number = useMemo(() => props.drawProperties.scale * 40, [props.drawProperties.scale])

  const handleMove = useCallback(
    (event: MouseEvent | KeyboardEvent): void => {
      const {
        drawProperties,
        memeSelected,
        item: { ...item }
      } = props
      let { top, left } = state
      const { downStartX, downStartY, downPageY, downPageX } = state
      let { centerX, centerY, height, width, rotate } = item

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
          const resation = resize({
            currentLeft: left,
            currentTop: top,
            maxWidth: props.drawProperties.width,
            maxHeight: props.drawProperties.height,
            minWidth: 300,
            minHeight: 300,
            previousHeight: state.lastHeight,
            previousWidth: state.lastWidth,
            previousTop: state.lastTop,
            previousLeft: state.lastLeft,
            spacingHeight: event.pageY - downPageY,
            spacingWidth: event.pageX - downPageX,
            keepRatio: true,
            side: state.side
          })

          width = resation.width || width
          height = resation.height || height
          top = resation.top
          left = resation.left

          centerY = top + height / 2
          centerX = left + width / 2
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
        item.centerX = centerX
        item.centerY = centerY
        item.width = width
        item.height = height
        item.rotate = rotate
        item.base = {
          centerX: (centerX / drawProperties.width) * memeSelected.width,
          centerY: (centerY / drawProperties.height) * memeSelected.height,
          width: (width / drawProperties.width) * memeSelected.width,
          height: (height / drawProperties.height) * memeSelected.height
        }
        if (props.type === 'text') {
          props.saveToEditor({ type: CUSTOM_TEXT, text: item, historyType: toHistoryType(type) })
        } else {
          props.saveToEditor({ type: CUSTOM_IMAGE, image: item, historyType: toHistoryType(type) })
        }

        setState({ ...state, top, left })
      }
    },
    [props.drawProperties, state, minimalSize, props.memeSelected, props.item, props.saveToEditor, setState, props.type]
  )

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      event.persist()
      const type = event.currentTarget.getAttribute('data-type')
      const side = event.currentTarget.getAttribute('data-side') as StateInt['side']
      const { left, top } = draggableRef.current.getBoundingClientRect()
      const { width, height, rotate } = props.item
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
    [props.item, setState]
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
      id={props.item.id}
      data-type="drag"
      className={`draggable text-box ${props.isSelected ? 'draggable-active' : ''}`}
      style={{
        transform: `translate3d(${Math.round(state.left)}px, ${Math.round(state.top)}px, 0) rotate(${props.item.rotate}deg)`,
        height: Math.round(props.item.height),
        width: Math.round(props.item.width),
        zIndex: props.zIndex,
        ...(props.type === 'image'
          ? {
              background: `url(${props.item.src}) center center/100% 100% no-repeat`
            }
          : null)
      }}
      onMouseDown={handleMouseDown}
      onClick={(): void => !props.isSelected && props.setTextSelected(props.item.id)}
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
