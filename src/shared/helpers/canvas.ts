import * as R from 'ramda'

import { degreeToRad } from './number'

const PADDING_INLINE = 4
const PADDING_BLOCK = 8

type Line = {
  x: number
  y: number
  value: string
  getHeight: (fontSize: number) => number
  getWidth: () => number
}

function getLines(text: TextBox, context2D: CanvasRenderingContext2D): Line[] {
  return R.pipe(R.replace(/\r/g, ''), R.split('\n'), (textLines) => {
    return textLines.map((currentTextLine: string, index: number) => {
      return {
        x: 0,
        y: 0,
        value: currentTextLine,
        getHeight: (fontSize: number) => {
          return textLines.length > 1 && index !== textLines.length - 1
            ? Math.round(1.2 * fontSize)
            : fontSize
        },
        getWidth: () => {
          return context2D.measureText(currentTextLine).width
        }
      }
    })
  })(text.value)
}

function applyFontSizeByWidth(
  text: TextBox,
  lines: Line[],
  context2D: CanvasRenderingContext2D
): number {
  let { fontSize } = text
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    context2D.font = `${fontSize}px ${text.fontFamily}`
    while (line.getWidth() + PADDING_INLINE * 2 > text.width) {
      fontSize -= 1
      context2D.font = `${fontSize}px ${text.fontFamily}`
    }
  }
  return fontSize
}

function applyFontSizeByHeight(
  text: TextBox,
  lines: Line[],
  initialFontSize: number
): { fontSize: number; linesHeight: number } {
  let fontSize = initialFontSize
  const getTotalHeight = R.reduce((totalHeight, current: Line) => {
    return R.add(totalHeight, current.getHeight(fontSize))
  }, 0)

  while (getTotalHeight(lines) > text.height - PADDING_BLOCK * 2) {
    fontSize -= 1
  }

  return {
    fontSize,
    linesHeight: getTotalHeight(lines)
  }
}

export function drawText(text: TextBox, context2D: CanvasRenderingContext2D) {
  context2D.save()
  context2D.fillStyle = text.color || 'black'
  context2D.textBaseline = 'top'
  context2D.strokeStyle = 'black'
  context2D.lineJoin = 'round'
  context2D.lineWidth = text.boxShadow || 1
  context2D.font = `${text.fontSize}px ${text.fontFamily}`
  if (text.rotate !== 0) {
    context2D.translate(text.centerX, text.centerY)
    context2D.rotate(degreeToRad(text.rotate))
    context2D.translate(-text.centerX, -text.centerY)
  }

  const lines = getLines(text, context2D)
  const { fontSize, linesHeight } = applyFontSizeByHeight(
    text,
    lines,
    applyFontSizeByWidth(text, lines, context2D)
  )
  context2D.font = `${fontSize}px ${text.fontFamily}`

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const previousLine = lines[index - 1]
    const previousLineHeight =
      index === 0 ? 0 : previousLine.getHeight(fontSize)
    const lineWidth = line.getWidth()

    if (text.textAlign === 'left') {
      line.x = text.centerX - text.width / 2 + PADDING_INLINE
    } else if (text.textAlign === 'center') {
      line.x = text.centerX - lineWidth / 2
    } else {
      line.x = text.centerX + text.width / 2 - lineWidth - PADDING_INLINE
    }

    if (text.alignVertical === 'top') {
      if (index === 0) {
        line.y = text.centerY - text.height / 2 + PADDING_BLOCK
      } else {
        line.y = previousLine.y + previousLineHeight
      }
    } else if (text.alignVertical === 'middle') {
      if (index === 0) {
        line.y = text.centerY - linesHeight / 2
      } else {
        line.y = previousLine.y + previousLineHeight
      }
    } else if (index === 0) {
      line.y = text.centerY + text.height / 2 - PADDING_BLOCK - linesHeight
    } else {
      line.y = previousLine.y + previousLineHeight
    }

    const { x } = line
    const { y } = line
    context2D.fillText(line.value, x, y)
    if (text.boxShadow > 0) {
      context2D.strokeText(line.value, x, y)
    }
  }
  context2D.restore()
}
