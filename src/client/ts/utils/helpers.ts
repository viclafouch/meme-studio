import { formatRelative, format } from 'date-fns'
import {
  RESIZE,
  MOVE,
  ROTATE,
  EDIT_FONT_FAMILY,
  EDIT_FONT_SIZE,
  EDIT_COLOR,
  EDIT_TEXT_ALIGN,
  EDIT_TEXT_VERTICAL,
  EDIT_UPPERCASE,
  EDIT_VALUE,
  EDIT_KEEP_RATIO
} from '@client/ts/shared/constants'
import { typeString, RecoverVersionInt, HistoryInt } from '@client/ts/shared/validators'
import Meme from '../shared/models/Meme'

export const shuffle = ([...array]: Array<any>): Array<any> => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

export const calculateAspectRatioFit = (
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
  return { width: srcWidth * ratio, height: srcHeight * ratio }
}

export const toHistoryType = (type: typeString): string => {
  switch (type) {
    case 'resize':
      return RESIZE
    case 'move':
      return MOVE
    case 'rotate':
      return ROTATE
    case 'fontFamily':
      return EDIT_FONT_FAMILY
    case 'fontSize':
      return EDIT_FONT_SIZE
    case 'color':
      return EDIT_COLOR
    case 'textAlign':
      return EDIT_TEXT_ALIGN
    case 'alignVertical':
      return EDIT_TEXT_VERTICAL
    case 'isUppercase':
      return EDIT_UPPERCASE
    case 'value':
      return EDIT_VALUE
    case 'keepRatio':
      return EDIT_KEEP_RATIO
    default:
      return type
  }
}

export const hasRecoverVersion = (): false | RecoverVersionInt => {
  let lastEditDate: string | Date = window.localStorage.getItem('lastEditDate')
  if (lastEditDate) {
    const now = new Date()
    try {
      lastEditDate = new Date(JSON.parse(lastEditDate))
      const hourDifference = Math.abs(now.getTime() - lastEditDate.getTime()) / 36e5
      if (hourDifference > 2) return false
      let memeSelected: string | Meme = window.localStorage.getItem('memeSelected')
      let history: string | any = window.localStorage.getItem('history')
      memeSelected = new Meme(JSON.parse(memeSelected)) as Meme
      history = JSON.parse(history) as {
        items: Array<HistoryInt>
        currentIndex: number
      }

      return { memeSelected, history, lastEditDate }
    } catch (error) {
      console.warn(error)
      return false
    }
  }
  return false
}

const getLocale = (locale = window.localStorage.i18nextLng): object => {
  if (!['fr', 'en-US'].includes(locale)) locale = 'en-US'
  return require(`date-fns/locale/${locale}/index.js`)
}

export const formatDate = (date: Date, formatStyle: string, locale?: string): string =>
  format(date, formatStyle, {
    locale: getLocale(locale)
  })

export const formatRelativeDate = (date: Date, baseDate: Date, locale?: string): string =>
  formatRelative(date, baseDate, {
    locale: getLocale(locale)
  })

export const resize = ({
  keepRatio,
  side,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  previousHeight,
  previousWidth,
  spacingHeight,
  spacingWidth,
  previousTop,
  previousLeft,
  currentTop,
  currentLeft,
  widthOnePercent,
  heightOnePercent
}: {
  keepRatio: boolean
  side: 'ne' | 'se' | 'sw' | 'nw'
  maxWidth: number
  maxHeight: number
  minWidth: number
  minHeight: number
  spacingHeight: number
  spacingWidth: number
  previousHeight: number
  previousWidth: number
  previousTop: number
  previousLeft: number
  currentTop: number
  currentLeft: number
  widthOnePercent: number
  heightOnePercent: number
}): { height: number; width: number; top: number; left: number } => {
  let height: number
  let width: number

  const right = maxWidth - (previousLeft + previousWidth)
  const bottom = maxHeight - (previousTop + previousHeight)

  if (!keepRatio) {
    if (side === 'sw' || side === 'se') {
      if (previousHeight + spacingHeight > minHeight) {
        height = previousHeight + spacingHeight
        if (currentTop + height >= maxHeight) height = maxHeight - currentTop
      } else height = minHeight
    } else if (side === 'nw' || side === 'ne') {
      if (previousHeight - spacingHeight > minHeight) {
        currentTop = previousTop + spacingHeight
        if (currentTop < 0) {
          currentTop = 0
          height = maxHeight - bottom
        } else height = previousHeight - spacingHeight
      } else {
        height = minHeight
        currentTop = maxHeight - bottom - height
      }
    }

    if (side === 'ne' || side === 'se') {
      if (previousWidth + spacingWidth > minWidth) {
        width = previousWidth + spacingWidth
        if (currentLeft + width >= maxWidth) width = maxWidth - currentLeft
      } else width = minWidth
    } else if (side === 'nw' || side === 'sw') {
      if (previousWidth - spacingWidth > minWidth) {
        currentLeft = previousLeft + spacingWidth
        if (currentLeft <= 0) {
          currentLeft = 0
          width = maxWidth - right
        } else width = previousWidth - spacingWidth
      } else {
        width = minWidth
        currentLeft = maxWidth - right - width
      }
    }
  } else {
    if (side === 'se') {
      let newWidth = previousWidth + spacingWidth
      if (currentLeft + newWidth >= maxWidth) {
        newWidth = maxWidth - currentLeft
      }

      const relativeWidthPercent = newWidth / widthOnePercent
      let newHeight = heightOnePercent * relativeWidthPercent

      if (currentTop + newHeight > maxHeight) {
        newHeight = maxHeight - currentTop
        const relativeHeightPercent = newHeight / heightOnePercent
        newWidth = widthOnePercent * relativeHeightPercent
      }

      if (newWidth > minWidth && newHeight > minHeight) {
        width = newWidth
        height = newHeight
      }
    } else if (side === 'ne') {
      let newWidth = previousWidth + spacingWidth
      if (currentLeft + newWidth >= maxWidth) {
        newWidth = maxWidth - currentLeft
      }

      const relativeWidthPercent = newWidth / widthOnePercent
      let newHeight = heightOnePercent * relativeWidthPercent
      let newTop = maxHeight - bottom - newHeight

      if (newTop < 0) {
        newTop = 0
        newHeight = maxHeight - bottom
        const relativeHeightPercent = newHeight / heightOnePercent
        newWidth = widthOnePercent * relativeHeightPercent
      }

      if (newWidth > minWidth && newHeight > minHeight) {
        width = newWidth
        height = newHeight
        currentTop = newTop
      }
    } else if (side === 'sw') {
      let newWidth = previousWidth - spacingWidth
      let newLeft = maxWidth - right - newWidth

      if (newLeft < 0) {
        newWidth = maxWidth - right
        newLeft = 0
      }

      const relativeWidthPercent = newWidth / widthOnePercent
      let newHeight = heightOnePercent * relativeWidthPercent

      if (currentTop + newHeight > maxHeight) {
        newHeight = maxHeight - currentTop
        const relativeHeightPercent = newHeight / heightOnePercent
        newWidth = widthOnePercent * relativeHeightPercent
        newLeft = maxWidth - right - newWidth
      }

      if (newWidth > minWidth && newHeight > minHeight) {
        width = newWidth
        height = newHeight
        currentLeft = newLeft
      }
    } else {
      let newWidth = previousWidth - spacingWidth
      let newLeft = maxWidth - right - newWidth
      let relativeWidthPercent = newWidth / widthOnePercent
      let newHeight = heightOnePercent * relativeWidthPercent
      let newTop = maxHeight - bottom - newHeight

      if (newLeft < 0) {
        newWidth = previousWidth - spacingWidth + newLeft
        newLeft = 0
        relativeWidthPercent = newWidth / widthOnePercent
        newHeight = heightOnePercent * relativeWidthPercent
        newTop = maxHeight - bottom - newHeight
      }

      if (newTop < 0) {
        newHeight = maxHeight - bottom
        newTop = 0
        const relativeHeightPercent = newHeight / heightOnePercent
        newWidth = widthOnePercent * relativeHeightPercent
        newLeft = maxWidth - right - newWidth
      }

      if (newWidth > minWidth && newHeight > minHeight) {
        width = newWidth
        height = newHeight
        currentLeft = newLeft
        currentTop = newTop
      }
    }
  }

  return { height, width, top: currentTop, left: currentLeft }
}
