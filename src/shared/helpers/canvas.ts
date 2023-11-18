import * as R from 'ramda'
import { Meme } from '@models/Meme'
import { TextBox } from '@shared/schemas/textbox'
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

function getLines(
  textboxProperties: TextBox['properties'],
  context2D: CanvasRenderingContext2D
): Line[] {
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
  })(
    textboxProperties.isUppercase
      ? textboxProperties.value.toUpperCase()
      : textboxProperties.value
  )
}

function applyFontSizeByWidth(
  textboxProperties: TextBox['properties'],
  lines: Line[],
  context2D: CanvasRenderingContext2D
): number {
  let { fontSize } = textboxProperties

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] as Line
    context2D.font = `${fontSize}px ${textboxProperties.fontFamily}`

    while (line.getWidth() + PADDING_INLINE * 2 > textboxProperties.width) {
      fontSize -= 1
      context2D.font = `${fontSize}px ${textboxProperties.fontFamily}`
    }
  }

  return fontSize
}

function applyFontSizeByHeight(
  textboxProperties: TextBox['properties'],
  lines: Line[],
  initialFontSize: number
): { fontSize: number; linesHeight: number } {
  let fontSize = initialFontSize
  const getTotalHeight = R.reduce((totalHeight, current: Line) => {
    return R.add(totalHeight, current.getHeight(fontSize))
  }, 0)

  while (getTotalHeight(lines) > textboxProperties.height - PADDING_BLOCK * 2) {
    fontSize -= 1
  }

  return {
    fontSize,
    linesHeight: getTotalHeight(lines)
  }
}

export function drawText(
  textbox: TextBox,
  context2D: CanvasRenderingContext2D
) {
  const { properties } = textbox
  context2D.save()
  context2D.fillStyle = properties.color || 'black'
  context2D.textBaseline = 'top'
  context2D.strokeStyle = 'black'
  context2D.lineJoin = 'round'
  context2D.lineWidth = properties.boxShadow || 1
  context2D.font = `${properties.fontSize}px ${properties.fontFamily}`

  if (properties.rotate !== 0) {
    context2D.translate(properties.centerX, properties.centerY)
    context2D.rotate(degreeToRad(properties.rotate))
    context2D.translate(-properties.centerX, -properties.centerY)
  }

  const lines = getLines(properties, context2D)
  const { fontSize, linesHeight } = applyFontSizeByHeight(
    properties,
    lines,
    applyFontSizeByWidth(properties, lines, context2D)
  )
  context2D.font = `${fontSize}px ${properties.fontFamily}`

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] as Line
    const previousLine = lines[index - 1] as Line
    const previousLineHeight =
      index === 0 ? 0 : previousLine.getHeight(fontSize)
    const lineWidth = line.getWidth()

    if (properties.textAlign === 'left') {
      line.x = properties.centerX - properties.width / 2 + PADDING_INLINE
    } else if (properties.textAlign === 'center') {
      line.x = properties.centerX - lineWidth / 2
    } else {
      line.x =
        properties.centerX + properties.width / 2 - lineWidth - PADDING_INLINE
    }

    if (properties.alignVertical === 'top') {
      if (index === 0) {
        line.y = properties.centerY - properties.height / 2 + PADDING_BLOCK
      } else {
        line.y = previousLine.y + previousLineHeight
      }
    } else if (properties.alignVertical === 'middle') {
      if (index === 0) {
        line.y = properties.centerY - linesHeight / 2
      } else {
        line.y = previousLine.y + previousLineHeight
      }
    } else if (index === 0) {
      line.y =
        properties.centerY + properties.height / 2 - PADDING_BLOCK - linesHeight
    } else {
      line.y = previousLine.y + previousLineHeight
    }

    const { x } = line
    const { y } = line
    context2D.fillText(line.value, x, y)

    if (properties.boxShadow > 0) {
      context2D.strokeText(line.value, x, y)
    }
  }

  context2D.restore()
}

export async function exportCanvasBlob({
  meme,
  texts
}: {
  meme: Meme
  texts: TextBox[]
}): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = meme.width
  canvas.height = meme.height
  const context2D = canvas.getContext('2d') as CanvasRenderingContext2D
  const image = await meme.image
  context2D.drawImage(image, 0, 0, meme.width, meme.height)

  for (const text of texts) {
    drawText(text, context2D)
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('toBlob failed'))
      }
    }, 'image/png')
  })
}
