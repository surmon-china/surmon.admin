/**
 * @file Article public state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { LockOutlined, UnlockOutlined, StopOutlined } from '@ant-design/icons'

/** 文章公开状态 */
export enum ArticlePublic {
  Reserve = 0, // 保留状态
  Public = 1, // 公开状态
  Secret = -1, // 私密
}

const articlePublicMap = new Map(
  [
    {
      id: ArticlePublic.Public,
      name: '公开',
      icon: <UnlockOutlined />,
      color: 'green',
    },
    {
      id: ArticlePublic.Secret,
      name: '私密',
      icon: <LockOutlined />,
      color: 'red',
    },
    {
      id: ArticlePublic.Reserve,
      name: '保留',
      icon: <StopOutlined />,
      color: 'orange',
    },
  ].map((item) => [item.id, item])
)

export const ap = (state: ArticlePublic) => {
  return articlePublicMap.get(state)!
}
export const articlePublics = Array.from<ReturnType<typeof ap>>(
  articlePublicMap.values()
)
