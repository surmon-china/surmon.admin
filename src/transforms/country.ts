/**
 * @file Emoji
 * @author Surmon <https://github.com/surmon-china>
 */

// offset between uppercase ascii and regional indicator symbols
const OFFSET = 127397

// fork from: https://github.com/danalloway/react-country-flag/blob/main/src/index.tsx
export const countryCodeToEmoji = (countryCode: string): string => {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + OFFSET))
}

export const isValidCountryCode = (countryCode: string): boolean => {
  try {
    return !!new Intl.DisplayNames('en', { type: 'region', fallback: 'code' }).of(countryCode)
  } catch (error) {
    return false
  }
}

export const countryCodeToFullName = (
  countryCode: string,
  language = navigator.language
): string | null => {
  try {
    const regionNames = new Intl.DisplayNames([language], { type: 'region' })
    return regionNames.of(countryCode) ?? null
  } catch (error) {
    return null
  }
}
