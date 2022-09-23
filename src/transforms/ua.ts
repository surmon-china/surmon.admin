/**
 * @file UA parser
 * @author Surmon <https://github.com/surmon-china>
 */

import { UAParser } from 'ua-parser-js'

export const parseBrowser = (userAgent: string) => {
  const result = new UAParser(userAgent).getBrowser()
  return result.name && result.version ? `${result.name} | ${result.version}` : null
}

export const parseOS = (userAgent: string) => {
  const result = new UAParser(userAgent).getOS()
  return result.name && result.version ? `${result.name} | ${result.version}` : null
}

export const parseDevice = (userAgent: string) => {
  const result = new UAParser(userAgent).getDevice()
  return result.model && result.vendor ? `${result.model} | ${result.vendor}` : null
}
