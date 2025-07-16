/**
 * @file Clipboard utilities
 * @author Surmon <https://github.com/surmon-china>
 */

export const readClipboard = () => {
  return navigator.clipboard.readText()
}

export const copyToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text)
}
