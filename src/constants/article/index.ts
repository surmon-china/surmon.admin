/**
 * @file Article constant
 * @author Surmon <https://github.com/surmon-china>
 */

import { DataExtends } from '../general'
import { PublishState } from '../publish'
import { Tag } from '../tag'
import { Category } from '../category'
import { ArticleOrigin } from './origin'
import { ArticlePublic } from './public'

export type ArticleId = string | number

/** 文章 */
export interface Article {
  id?: number
  _id?: ArticleId
  title: string
  description: string
  content?: string
  keywords: string[]
  meta?: {
    likes: number
    views: number
    comments: number
  }
  origin: ArticleOrigin
  public: ArticlePublic
  state: PublishState
  update_at?: string
  create_at?: string
  tag: Array<Tag>
  category: Array<Category>
  password?: string
  thumb?: string
  extends: Array<DataExtends>
}
