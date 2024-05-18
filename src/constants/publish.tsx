/**
 * @file General publish state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

/** 数据发布状态 */
export enum PublishState {
  Draft = 0, // 草稿
  Published = 1, // 已发布
  Recycle = -1 // 回收站
}

export const publishStates = [
  {
    id: PublishState.Draft,
    name: '草稿',
    icon: <Icons.EditOutlined />,
    color: 'orange'
  },
  {
    id: PublishState.Published,
    name: '已发布',
    icon: <Icons.CheckOutlined />,
    color: 'green'
  },
  {
    id: PublishState.Recycle,
    name: '回收站',
    icon: <Icons.DeleteOutlined />,
    color: 'red'
  }
]

const publishStateMap = new Map(publishStates.map((item) => [item.id, item]))

export const getPublishState = (state: PublishState) => {
  return publishStateMap.get(state)!
}
