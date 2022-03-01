/**
 * @file Feedback constant
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icon from '@ant-design/icons'
import { IPLocation } from './general'

export interface Feedback {
  _id: string
  id: number
  tid: number
  emotion: number
  emotion_text?: string
  emotion_emoji?: string
  content: string
  user_name?: string
  user_email?: string
  marked: boolean
  remark: string
  user_agent: string
  origin: string | null
  ip: string | null
  ip_location: IPLocation | null
  create_at?: string
  update_at?: string
}

const markedStateMap = new Map(
  [
    {
      number: 0,
      boolean: false,
      name: '未标记',
      icon: <Icon.StarOutlined />,
    },
    {
      number: 1,
      boolean: true,
      name: '已标记',
      icon: <Icon.StarFilled style={{ color: '#fadb14' }} />,
    },
  ].map((item) => [item.number, item])
)

export const getMarkedByNumber = (number: number) => {
  return markedStateMap.get(number)!
}

export const getMarkedByBoolean = (boolean: boolean) => {
  return markedStateMap.get(boolean ? 1 : 0)!
}

export const markedStates = Array.from<ReturnType<typeof getMarkedByNumber>>(
  markedStateMap.values()
)
