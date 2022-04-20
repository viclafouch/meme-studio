import * as R from 'ramda'

import { degreeToRad } from './number'

const PADDING_INLINE = 4
const PADDING_BLOCK = 8

type Line = {
  x: number
  y: number
  value: string
  lineHeight: () => number
  lineWidth: () => number
}

function getLines(text: MemeText, ctx: CanvasRenderingContext2D): Line[] {
  return R.pipe(R.replace(/\r/g, ''), R.split('\n'), (textLines) => {
    return textLines.map((currentTextLine: string, index: number) => {
      return {
        x: 0,
        y: 0,
        value: currentTextLine,
        lineHeight: () => {
          return textLines.length > 1 && index !== textLines.length - 1
            ? 1.2 * text.fontSize
            : text.fontSize
        },
        lineWidth: () => {
          return ctx.measureText(currentTextLine).width
        }
      }
    })
  })(text.value)
}

function applyMaxSize(
  text: MemeText,
  lines: Line[],
  ctx: CanvasRenderingContext2D
): number {
  let { fontSize } = text
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    ctx.font = `${fontSize}px ${text.fontFamily}`
    while (line.lineWidth() + PADDING_INLINE * 2 > text.width) {
      fontSize -= 1
      ctx.font = `${fontSize}px ${text.fontFamily}`
    }
  }
  return fontSize
}

export function drawText(text: MemeText, ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.fillStyle = text.color || 'black'
  ctx.textBaseline = 'top'
  ctx.strokeStyle = 'black'
  ctx.lineJoin = 'round'
  ctx.lineWidth = text.boxShadow || 1
  ctx.font = `${text.fontSize}px ${text.fontFamily}`
  if (text.rotate !== 0) {
    ctx.translate(text.centerX, text.centerY)
    ctx.rotate(degreeToRad(text.rotate))
    ctx.translate(-text.centerX, -text.centerY)
  }

  const lines = getLines(text, ctx)
  let fontSize = applyMaxSize(text, lines, ctx)
  const getTotalHeight = R.reduce((acc, current: Line) => {
    return R.add(acc, current.lineHeight())
  }, 0)

  while (getTotalHeight(lines) > text.height - PADDING_BLOCK * 2) {
    fontSize -= 1
    ctx.font = `${fontSize}px ${text.fontFamily}`
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const previousLineHeight = index === 0 ? 0 : lines[index - 1].lineHeight()
    const lineWidth = line.lineWidth()

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
        line.y = lines[index - 1].y + previousLineHeight
      }
    } else if (text.alignVertical === 'middle') {
      if (index === 0) {
        line.y = text.centerY - getTotalHeight(lines) / 2
      } else {
        line.y = lines[index - 1].y + previousLineHeight
      }
    } else if (index === 0) {
      line.y =
        text.centerY + text.height / 2 - PADDING_BLOCK - getTotalHeight(lines)
    } else {
      line.y = lines[index - 1].y + previousLineHeight
    }

    const { x } = line
    const { y } = line
    ctx.fillText(line.value, x, y)
    if (text.boxShadow > 0) {
      ctx.strokeText(line.value, x, y)
    }
  }
  ctx.restore()
}

// export function fillText({ text, ctx, maxWidth, maxHeight, fontSize, x, y }: IntFill): void {
//   ctx.save()
//   const str = text.value.replace(/\r/g, '')
//   const lines: Array<Line> = str.split('\n').map((str: string, index: number, arr: Array<string>) => ({
//     x: 0,
//     y: 0,
//     lineHeight: (): number => {
//       if (arr.length > 1) {
//         if (index === arr.length - 1) return fontSize
//         else return 1.2 * fontSize
//       } else {
//         return fontSize
//       }
//     },
//     value: text.isUppercase ? str.toUpperCase() : str,
//     lineWidth: (): number => ctx.measureText(text.isUppercase ? str.toUpperCase() : str).width
//   }))

//   const paddingX = 4
//   const paddingY = 8

//   ctx.fillStyle = text.color || 'black'
//   ctx.textBaseline = 'top'
//   ctx.strokeStyle = 'black'
//   ctx.lineJoin = 'round'

//   if (text.boxShadow > 0) ctx.lineWidth = text.boxShadow

//   for (const line of lines) {
//     ctx.font = `${fontSize}px ${text.fontFamily}`
//     while (line.lineWidth() + paddingX * 2 > maxWidth) {
//       fontSize--
//       ctx.font = `${fontSize}px ${text.fontFamily}`
//     }
//   }

//   const totalHeight = (): number => lines.reduce((accumulator, currentValue) => accumulator + currentValue.lineHeight(), 0)

//   while (totalHeight() > maxHeight - paddingY * 2) {
//     fontSize--
//     ctx.font = `${fontSize}px ${text.fontFamily}`
//   }

//   if (text.rotate !== 0) {
//     ctx.translate(x, y)
//     ctx.rotate(degreeToRad(text.rotate))
//     ctx.translate(-x, -y)
//   }

//   for (let index = 0; index < lines.length; index++) {
//     const line: Line = lines[index]
//     const previousLineHeight = index === 0 ? 0 : lines[index - 1].lineHeight()
//     const lineWidth = line.lineWidth()

//     if (text.textAlign === 'left') {
//       line.x = x - maxWidth / 2 + paddingX
//     } else if (text.textAlign === 'center') {
//       line.x = x - lineWidth / 2
//     } else {
//       line.x = x + maxWidth / 2 - lineWidth - paddingX
//     }

//     if (text.alignVertical === 'top') {
//       if (index === 0) line.y = y - maxHeight / 2 + paddingY
//       else line.y = lines[index - 1].y + previousLineHeight
//     } else if (text.alignVertical === 'middle') {
//       if (index === 0) line.y = y - totalHeight() / 2
//       else line.y = lines[index - 1].y + previousLineHeight
//     } else {
//       if (index === 0) line.y = y + maxHeight / 2 - paddingY - totalHeight()
//       else line.y = lines[index - 1].y + previousLineHeight
//     }

//     ctx.fillText(line.value, Math.round(line.x), Math.round(line.y))
//     if (text.boxShadow > 0) ctx.strokeText(line.value, Math.round(line.x), Math.round(line.y))
//   }
//   ctx.restore()
// }
