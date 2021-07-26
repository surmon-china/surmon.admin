/**
 * @file Article public state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { LockOutlined, UnlockOutlined, StopOutlined } from '@ant-design/icons'

/** 文章公开状态 */
export enum ArticlePublic {
  Password = 0, // 需要密码
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
      id: ArticlePublic.Password,
      name: '需密码',
      icon: <LockOutlined />,
      color: 'orange',
    },
    {
      id: ArticlePublic.Secret,
      name: '私密',
      icon: <StopOutlined />,
      color: 'red',
    },
  ].map((item) => [item.id, item])
)

export const ap = (state: ArticlePublic) => {
  return articlePublicMap.get(state)!
}
export const articlePublics = Array.from<ReturnType<typeof ap>>(
  articlePublicMap.values()
)
