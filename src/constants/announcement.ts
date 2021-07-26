/**
 * @file Announcement constants
 * @module constants.announcement
 * @author Surmon <https://github.com/surmon-china>
 */

/** 公告 */
export interface Announcement {
  id?: number
  _id?: string
  state: number
  content: string
  update_at: string
  create_at: string
}
