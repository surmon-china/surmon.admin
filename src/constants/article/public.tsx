/**
 * @file Article public state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

/** 文章公开状态 */
export enum ArticlePublic {
  Reserve = 0, // 保留状态
  Public = 1, // 公开状态
  Secret = -1 // 私密
}

export const articlePublics = [
  {
    id: ArticlePublic.Public,
    name: '公开',
    icon: <Icons.UnlockOutlined />,
    color: 'green'
  },
  {
    id: ArticlePublic.Secret,
    name: '私密',
    icon: <Icons.LockOutlined />,
    color: 'red'
  },
  {
    id: ArticlePublic.Reserve,
    name: '保留',
    icon: <Icons.StopOutlined />,
    color: 'orange'
  }
]

const articlePublicMap = new Map(articlePublics.map((item) => [item.id, item]))

export const getArticlePublic = (state: ArticlePublic) => {
  return articlePublicMap.get(state)!
}
