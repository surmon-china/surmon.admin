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
  keywords: Array<string>
  statement: string
  site_url: string
  site_email: string
  meta: {
    likes: number
  }
  blocklist: {
    ips: Array<string>
    mails: Array<string>
    keywords: Array<string>
  }
  friend_links: Array<GeneralKeyValue>
  ad_config: string
  update_at: string
}
