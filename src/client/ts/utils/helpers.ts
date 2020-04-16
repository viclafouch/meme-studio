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
} from '@client/ts/shared/constants'
import { typeString } from '@client/ts/shared/validators'
import { formatRelative, format } from 'date-fns'

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
    default:
      return type
  }
}

export const hasRecoverVersion = (): false | Date => {
  let lastEditDate: string | Date | undefined = window.localStorage.getItem('lastEditDate')
  if (lastEditDate !== undefined) {
    const now = new Date()
    lastEditDate = new Date(JSON.parse(lastEditDate))
    const hourDifference = Math.abs(now.getTime() - lastEditDate.getTime()) / 36e5
    return hourDifference < 2 ? lastEditDate : false
  }
  return false
}

const getLocale = (locale = window.localStorage.i18nextLng): object => {
  if (!['fr', 'en-US'].includes(locale)) locale = 'en-US'
  return require(`date-fns/locale/${locale}/index.js`)
}

export const formatDate = (date: Date, formatStyle: string, locale?: string): string =>
  format(date, formatStyle, {
    locale: getLocale(locale),
  })

export const formatRelativeDate = (date: Date, baseDate: Date, locale?: string): string =>
  formatRelative(date, baseDate, {
    locale: getLocale(locale),
  })
