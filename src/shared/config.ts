const IS_DEV = process.env.NODE_ENV !== 'production'

const PORT_CLIENT_DEV = 3000
const PORT_SERVER_DEV = 8080
const PORT_SERVER_PROD: number = JSON.parse(process.env.PORT || '3000')

const API_URL = IS_DEV ? `http://localhost:${PORT_SERVER_DEV}` : ''

const FONTS_FAMILY = [
  'Arial',
  'Helvetica',
  'Impact',
  'Arial Black',
  'Times New Roman',
  'Trebuchet MS',
  'Comic Sans MS',
  'Andale Mono'
]

const ALIGN_VERTICAL = ['top', 'middle', 'bottom']
const TEXT_ALIGN = ['left', 'center', 'right']

export { IS_DEV, PORT_SERVER_PROD, PORT_CLIENT_DEV, PORT_SERVER_DEV, API_URL, FONTS_FAMILY, ALIGN_VERTICAL, TEXT_ALIGN }
