/**
 * @file UA parser
 * @author Surmon <https://github.com/surmon-china>
 */

import { UAParser } from 'ua-parser-js'

const parser = new UAParser()

export const parseBrowser = (ua: string): string => {
  parser.setUA(ua)
  const result = parser.getBrowser()
  if (!result.name && !result.version) {
    return ua
  } else {
    return `${result.name || 'unknow'} | ${result.version || 'unknow'}`
  }
}

export const parseOS = (ua: string): string => {
  parser.setUA(ua)
  const result = parser.getOS()
  if (!result.name && !result.version) {
    return ua
  } else {
    return `${result.name || 'unknow'} | ${result.version || 'unknow'}`
  }
}
