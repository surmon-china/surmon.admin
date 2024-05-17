/**
 * @file Article public state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icon from '@ant-design/icons'

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
    icon: <Icon.UnlockOutlined />,
    color: 'green'
  },
  {
    id: ArticlePublic.Secret,
    name: '私密',
    icon: <Icon.LockOutlined />,
    color: 'red'
  },
  {
    id: ArticlePublic.Reserve,
    name: '保留',
    icon: <Icon.StopOutlined />,
    color: 'orange'
  }
]

const articlePublicMap = new Map(articlePublics.map((item) => [item.id, item]))

export const getArticlePublic = (state: ArticlePublic) => {
  return articlePublicMap.get(state)!
}
