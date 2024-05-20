/**
 * @file Article publish state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

/** 文章发布状态 */
export enum ArticlePublish {
  Draft = 0, // 草稿
  Published = 1, // 已发布
  Recycle = -1 // 回收站
}

export const articlePublishs = [
  {
    id: ArticlePublish.Draft,
    name: '草稿',
    icon: <Icons.EditOutlined />,
    color: 'orange'
  },
  {
    id: ArticlePublish.Published,
    name: '已发布',
    icon: <Icons.CheckOutlined />,
    color: 'green'
  },
  {
    id: ArticlePublish.Recycle,
    name: '回收站',
    icon: <Icons.DeleteOutlined />,
    color: 'red'
  }
]

const articlePublishMap = new Map(articlePublishs.map((item) => [item.id, item]))

export const getArticlePublish = (state: ArticlePublish) => {
  return articlePublishMap.get(state)!
}
