/**
 * @file Announcement constants
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

/** 公告 */
export interface Announcement {
  id?: number
  _id?: string
  state: AnnouncementState
  content: string
  updated_at: string
  created_at: string
}

export enum AnnouncementState {
  Unpublished = 0,
  Published = 1
}

export const announcementStates = [
  {
    id: AnnouncementState.Unpublished,
    name: '未发布',
    icon: <Icons.EditOutlined />,
    color: 'orange'
  },
  {
    id: AnnouncementState.Published,
    name: '已发布',
    icon: <Icons.CheckOutlined />,
    color: 'green'
  }
]

const announcementStateMap = new Map(announcementStates.map((item) => [item.id, item]))

export const getAnnouncementState = (state: AnnouncementState) => {
  return announcementStateMap.get(state)!
}
