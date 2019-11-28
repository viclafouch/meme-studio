export const debug = (str: string): void =>
  process.env.NODE_ENV !== 'production' && console.log(`%c ${str}`, 'color: yellow; font-weight: bold')

export const randomID = (): string =>
  '_' +
  Math.random()
    .toString(36)
    .substr(2, 9)

export const wait = (timeout = 1000): Promise<any> => new Promise(resolve => setTimeout(resolve, timeout))
