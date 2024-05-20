/**
 * @file Clipboard service
 * @author Surmon <https://github.com/surmon-china>
 */

export const read = () => navigator.clipboard.readText()
export const copy = (text: string) => navigator.clipboard.writeText(text)
