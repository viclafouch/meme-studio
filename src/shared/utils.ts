import * as shortid from 'shortid'

export const wait = (timeout = 1000): Promise<unknown> => new Promise(resolve => setTimeout(resolve, timeout))

export const randomID = (): string => shortid.generate()
