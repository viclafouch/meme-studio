export function preventEmptyTextValue(
  textValue: TextBox['value'],
  index: number
) {
  return textValue || `Texte #${index + 1}`
}
