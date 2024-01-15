export const IS_PROD = process.env.NODE_ENV === 'production'

export const baseURL = IS_PROD
  ? 'https://www.meme-studio.io'
  : 'http://localhost:8080'
