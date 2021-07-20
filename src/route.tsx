/**
 * @file App route config
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react';
import {
  DashboardOutlined,
  BulbOutlined,
  SettingOutlined,
  TagsOutlined,
  FolderOpenOutlined,
  EditOutlined,
  CoffeeOutlined,
  CommentOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';

export enum RouteKey {
  Hello,
  Dashboard,
  Profile,
  Announcement,
  Category,
  Tag,
  Comment,
  Article,
  ArticleList,
  ArticlePost,
  ArticleEdit,
}

export interface RouteConfig {
  id: RouteKey;
  name: string;
  path: string;
  icon?: React.ReactElement;
  getter?(...args: Array<any>): string;
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
      id: RouteKey.Article,
      name: '文章管理',
      path: '/article',
      icon: <CoffeeOutlined />,
    },
    {
      id: RouteKey.ArticleList,
      name: '文章列表',
      path: '/article/list',
      icon: <OrderedListOutlined />,
    },
    {
      id: RouteKey.ArticlePost,
      name: '新撰文章',
      path: '/article/post',
      icon: <EditOutlined />,
    },
    {
      id: RouteKey.ArticleEdit,
      name: '编辑文章',
      path: '/article/edit/:article_id',
      getter: (articleId: string) => `/article/edit/${articleId}`,
      icon: <EditOutlined />,
    },
  ].map((route) => [route.id, route])
);

export const rc = (routeKey: RouteKey): RouteConfig => {
  return routeMap.get(routeKey)!;
};
export const rcByPath = (routePath: string) => {
  return Array.from(routeMap.values()).find((route) => route.path === routePath);
};
export const isRoute = (routePath: string, routeKey: RouteKey) => {
  return routeMap.get(routeKey)?.path === routePath;
};
