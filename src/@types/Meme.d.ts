interface MemeText {
  isUppercase: boolean
  id: string
  value: string
  width: number
  height: number
  centerX: number
  centerY: number
  rotate: number
  fontSize: number
  fontFamily: string
  boxShadow: number
  color: string
  alignVertical: string
  textAlign: string
  createdAt: string
  updatedAt: string
}

type Lang = 'en' | 'fr'

interface Meme {
  width: number
  height: number
  boxCount: number
  filename: string
  id: string
  translations: {
    [key in Lang]: {
      name: string
      keywords: string
    }
  }
  texts: MemeText[]
  createdAt: string
  updatedAt: string
}
