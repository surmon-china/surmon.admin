/**
 * @file Tag interface
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue } from './general'

/** 标签数据 */
export interface Tag {
  id?: number
  _id?: string
  name: string
  slug: string
  description: string
  updated_at: string
  created_at: string
  extends: GeneralKeyValue[]
  article_count?: number
}
