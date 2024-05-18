/**
 * @file Article origin state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

/** 文章来源 */
export enum ArticleOrigin {
  Original = 0, // 原创
  Reprint = 1, // 转载
  Hybrid = 2 // 混合
}

export const articleOrigins = [
  {
    id: ArticleOrigin.Original,
    name: '原创',
    icon: <Icons.EditOutlined />,
    color: 'green'
  },
  {
    id: ArticleOrigin.Reprint,
    name: '转载',
    icon: <Icons.CopyOutlined />,
    color: 'red'
  },
  {
    id: ArticleOrigin.Hybrid,
    name: '衍生',
    icon: <Icons.PullRequestOutlined />,
    color: 'orange'
  }
]

const articleOriginMap = new Map(articleOrigins.map((item) => [item.id, item]))

export const getArticleOrigin = (state: ArticleOrigin) => {
  return articleOriginMap.get(state)!
}
