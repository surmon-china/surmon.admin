/**
 * @file Comment interface
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue, IPLocation } from '../general'
import { CommentState } from './state'

/** 留言板 ID */
export const COMMENT_GUESTBOOK_POST_ID = 0

/** 评论 */
export interface Comment {
  id: number
  _id: string
  pid: number
  post_id: number
  content: string
  agent: string
  state: CommentState
  likes: number
  dislikes: number
  author: {
    name: string
    site?: string
    email?: string
    email_hash: string | null
  }
  ip: string | null
  ip_location: IPLocation | null
  updated_at?: string
  created_at?: string
  extends: Array<GeneralKeyValue>
}
