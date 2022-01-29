export function matchIsClientSide(): boolean {
  return typeof window !== 'undefined'
}
