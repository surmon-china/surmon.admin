/**
 * @file Tag interface
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralExtend } from './general'

/** 标签数据 */
export interface Tag {
  id?: number
  _id?: string
  name: string
  slug: string
  description: string
  update_at: string
  create_at: string
  extends: Array<GeneralExtend>
  articles_count?: number
}
