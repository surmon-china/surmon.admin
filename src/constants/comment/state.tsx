/**
 * @file Comment state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

/** 评论状态 */
export enum CommentState {
  Auditing = 0, // 待审核
  Published = 1, // 通过正常
  Deleted = -1, // 已删除
  Spam = -2 // 垃圾评论
}

export const commentStates = [
  {
    id: CommentState.Auditing,
    name: '待审核',
    icon: <Icons.EditOutlined />,
    color: 'blue'
  },
  {
    id: CommentState.Published,
    name: '已发布',
    icon: <Icons.CheckOutlined />,
    color: 'green'
  },
  {
    id: CommentState.Spam,
    name: '垃圾评论',
    icon: <Icons.StopOutlined />,
    color: 'red'
  },
  {
    id: CommentState.Deleted,
    name: '回收站',
    icon: <Icons.DeleteOutlined />,
    color: 'orange'
  }
]

const commentStateMap = new Map(commentStates.map((item) => [item.id, item]))

export const getCommentState = (state: CommentState) => {
  return commentStateMap.get(state)!
}
