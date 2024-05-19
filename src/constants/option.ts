/**
 * @file Option interface
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue } from './general'

/** 设置 */
export interface Option {
  title: string
  sub_title: string
  description: string
  keywords: string[]
  statement: string
  site_url: string
  site_email: string
  meta: {
    likes: number
  }
  blocklist: {
    ips: string[]
    mails: string[]
    keywords: string[]
  }
  friend_links: GeneralKeyValue[]
  ad_config: string
  updated_at: string
}
