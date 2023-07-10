/**
 * @file Article origin state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icon from '@ant-design/icons'

/** 文章来源 */
export enum ArticleOrigin {
  Original = 0, // 原创
  Reprint = 1, // 转载
  Hybrid = 2 // 混合
}

const articleOriginMap = new Map(
  [
    {
      id: ArticleOrigin.Original,
      name: '原创',
      icon: <Icon.EditOutlined />,
      color: 'green'
    },
    {
      id: ArticleOrigin.Reprint,
      name: '转载',
      icon: <Icon.CopyOutlined />,
      color: 'red'
    },
    {
      id: ArticleOrigin.Hybrid,
      name: '衍生',
      icon: <Icon.PullRequestOutlined />,
      color: 'orange'
    }
  ].map((item) => [item.id, item])
)

export const ao = (state: ArticleOrigin) => articleOriginMap.get(state)!
export const articleOrigins = Array.from<ReturnType<typeof ao>>(articleOriginMap.values())
