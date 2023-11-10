export function preventEmptyTextValue(value: string, index: number) {
  return value || `Texte #${index + 1}`
}
