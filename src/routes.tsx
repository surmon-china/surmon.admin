/**
 * @file App route config
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { generatePath } from 'react-router-dom'
import {
  DashboardOutlined,
  BulbOutlined,
  SettingOutlined,
  TagsOutlined,
  FolderOpenOutlined,
  EditOutlined,
  CoffeeOutlined,
  CloudSyncOutlined,
  CommentOutlined,
  AppstoreOutlined,
  MessageOutlined,
  OrderedListOutlined,
} from '@ant-design/icons'

export enum RouteKey {
  Hello,
  Dashboard,
  Profile,
  Announcement,
  Category,
  Tag,
  Comment,
  Disqus,
  DisqusThread,
  DisqusPost,
  DisqusSync,
  Article,
  ArticleList,
  ArticlePost,
  ArticleEdit,
}

export interface RouteConfig {
  id: RouteKey
  name: string
  path: string
  subPath?: string
  icon?: React.ReactElement
  pather?(...args: Array<any>): string
}
export const routeMap: ReadonlyMap<RouteKey, RouteConfig> = new Map(
  [
    {
      id: RouteKey.Hello,
      name: '来者何人',
      path: '/hello',
    },
    {
      id: RouteKey.Dashboard,
      name: '超级看板',
      path: '/dashboard',
      icon: <DashboardOutlined />,
    },
    {
      id: RouteKey.Profile,
      name: '系统设置',
      path: '/profile',
      icon: <SettingOutlined />,
    },
    {
      id: RouteKey.Announcement,
      name: '公告管理',
      path: '/announcement',
      icon: <BulbOutlined />,
    },
    {
      id: RouteKey.Category,
      name: '分类管理',
      path: '/category',
      icon: <FolderOpenOutlined />,
    },
    {
      id: RouteKey.Tag,
      name: '标签管理',
      path: '/tag',
      icon: <TagsOutlined />,
    },
    {
      id: RouteKey.Comment,
      name: '评论管理',
      path: '/comment',
      icon: <CommentOutlined />,
    },
    {
      id: RouteKey.Disqus,
      name: 'Disqus',
      path: '/disqus',
      icon: <MessageOutlined />,
    },
    {
      id: RouteKey.DisqusPost,
      name: 'Posts',
      path: '/disqus/posts',
      subPath: 'posts',
      icon: <MessageOutlined />,
    },
    {
      id: RouteKey.DisqusThread,
      name: 'Threads',
      path: '/disqus/threads',
      subPath: 'threads',
      icon: <AppstoreOutlined />,
    },
    {
      id: RouteKey.DisqusSync,
      name: 'Synchronize',
      path: '/disqus/synchronize',
      subPath: 'synchronize',
      icon: <CloudSyncOutlined />,
    },
    {
      id: RouteKey.Article,
      name: '文章管理',
      path: '/article',
      icon: <CoffeeOutlined />,
    },
    {
      id: RouteKey.ArticleList,
      name: '文章列表',
      path: '/article/list',
      subPath: 'list',
      icon: <OrderedListOutlined />,
    },
    {
      id: RouteKey.ArticlePost,
      name: '新撰文章',
      path: '/article/post',
      subPath: 'post',
      icon: <EditOutlined />,
    },
    {
      id: RouteKey.ArticleEdit,
      name: '编辑文章',
      path: '/article/edit/:article_id',
      subPath: 'edit/:article_id',
      icon: <EditOutlined />,
      pather(article_id: string) {
        return generatePath(this.path, { article_id })
      },
    },
  ].map((route) => [route.id, route])
)

export const rc = (routeKey: RouteKey): RouteConfig => {
  return routeMap.get(routeKey)!
}
export const rcByPath = (routePath: string) => {
  return Array.from(routeMap.values()).find((route) => route.path === routePath)
}
export const isRoute = (routePath: string, routeKey: RouteKey) => {
  return routeMap.get(routeKey)?.path === routePath
}
