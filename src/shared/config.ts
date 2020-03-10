const IS_DEV = process.env.NODE_ENV !== 'production'

const PORT_CLIENT_DEV = 3000
const PORT_API_DEV = 8080
const PORT_ALL_PROD: number = JSON.parse(process.env.PORT || '3000')

const API_URL = IS_DEV ? `http://localhost:${PORT_API_DEV}` : '' // TODO

export { IS_DEV, PORT_ALL_PROD, PORT_CLIENT_DEV, PORT_API_DEV, API_URL }
