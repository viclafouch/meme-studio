export const debug = (str: string): void =>
  process.env.NODE_ENV !== 'production' && console.log(`%c ${str}`, 'color: yellow; font-weight: bold')
