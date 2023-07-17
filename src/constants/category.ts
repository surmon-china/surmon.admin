/**
 * @file Category constant
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue } from './general'

/** 分类 */
export interface Category {
  id?: number
  _id?: string
  pid?: string | null
  name: string
  slug: string
  description: string
  updated_at: string
  created_at: string
  children?: Array<Category>
  extends: Array<GeneralKeyValue>
  article_count?: number
}
