export const debug = (str: string): void =>
  process.env.NODE_ENV !== 'production' && console.log(`%c ${str}`, 'color: yellow; font-weight: bold')

export const randomID = (): string =>
  '_' +
  Math.random()
    .toString(36)
    .substr(2, 9)

export const wait = (timeout = 1000): Promise<any> => new Promise(resolve => setTimeout(resolve, timeout))

export const innerDemensions = (node: HTMLElement): { height: number; width: number } => {
  const computedStyle: CSSStyleDeclaration = getComputedStyle(node)
  let height: number = node.clientHeight
  let width: number = node.clientWidth
  height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
  width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
  return { height, width }
}
