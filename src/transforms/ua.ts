/**
 * @file UA parser
 * @author Surmon <https://github.com/surmon-china>
 */

import { UAParser } from 'ua-parser-js'

export const parseBrowser = (userAgent: string) => {
  const { browser } = UAParser(userAgent)
  return browser.name && browser.version ? `${browser.name} | ${browser.version}` : null
}

export const parseOS = (userAgent: string) => {
  const { os } = UAParser(userAgent)
  return os.name && os.version ? `${os.name} | ${os.version}` : null
}

export const parseDevice = (userAgent: string) => {
  const { device } = UAParser(userAgent)
  return device.model && device.vendor ? `${device.model} | ${device.vendor}` : null
}
