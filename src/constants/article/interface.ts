/**
 * @file Article interface
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue } from '../general'
import { PublishState } from '../publish'
import { Category } from '../category'
import { Tag } from '../tag'
import { ArticleOrigin } from './origin'
import { ArticlePublic } from './public'
import { ArticleLanguage } from './language'

export type ArticleId = string | number

/** 文章 */
export interface Article {
  id?: number
  _id?: string
  slug: string | null
  title: string
  content?: string
  description: string
  keywords: string[]
  thumbnail?: string
  tags: Array<Tag>
  categories: Array<Category>
  origin: ArticleOrigin
  public: ArticlePublic
  state: PublishState
  lang: ArticleLanguage
  featured: boolean
  disabled_comments: boolean
  meta?: {
    likes: number
    views: number
    comments: number
  }
  updated_at?: string
  created_at?: string
  extends: Array<GeneralKeyValue>
}
