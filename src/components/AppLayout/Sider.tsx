import classnames from 'classnames'
import React from 'react'
import { useComputed } from 'veact'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, Spin, Typography, MenuProps } from 'antd'
import * as Icon from '@ant-design/icons'

import { GITHUB_REPO_URL } from '@/config'
import { getResourceUrl } from '@/transforms/url'
import { RouteKey, rc } from '@/routes'
import { useAdminState } from '@/state/admin'

import styles from './style.module.less'
export interface AppSiderProps {
  isSiderCollapsed: boolean
}
export const AppSider: React.FC<AppSiderProps> = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const admin = useAdminState()

  const mainMenuItems = useComputed<NonNullable<MenuProps['items']>>(() => {
    return [
      {
        key: rc(RouteKey.Dashboard).path,
        icon: rc(RouteKey.Dashboard).icon,
        label: rc(RouteKey.Dashboard).name
      },
      {
        key: rc(RouteKey.Announcement).path,
        icon: rc(RouteKey.Announcement).icon,
        label: rc(RouteKey.Announcement).name
      },
      {
        key: rc(RouteKey.Category).path,
        icon: rc(RouteKey.Category).icon,
        label: rc(RouteKey.Category).name
      },
      {
        key: rc(RouteKey.Tag).path,
        icon: rc(RouteKey.Tag).icon,
        label: rc(RouteKey.Tag).name
      },
      {
        key: rc(RouteKey.Article).path,
        icon: rc(RouteKey.Article).icon,
        label: rc(RouteKey.Article).name,
        children: [
          {
            key: rc(RouteKey.ArticleList).path,
            label: rc(RouteKey.ArticleList).name
          },
          {
            key: rc(RouteKey.ArticlePost).path,
            label: rc(RouteKey.ArticlePost).name
          }
        ]
      },
      {
        key: rc(RouteKey.Comment).path,
        icon: rc(RouteKey.Comment).icon,
        label: rc(RouteKey.Comment).name
      },
      {
        key: rc(RouteKey.Disqus).path,
        icon: rc(RouteKey.Disqus).icon,
        label: rc(RouteKey.Disqus).name,
        children: [
          {
            key: rc(RouteKey.DisqusPost).path,
            label: rc(RouteKey.DisqusPost).name
          },
          {
            key: rc(RouteKey.DisqusThread).path,
            label: rc(RouteKey.DisqusThread).name
          },
          {
            key: rc(RouteKey.DisqusSync).path,
            label: rc(RouteKey.DisqusSync).name
          }
        ]
      },
      {
        key: rc(RouteKey.Vote).path,
        icon: rc(RouteKey.Vote).icon,
        label: rc(RouteKey.Vote).name
      },
      {
        key: rc(RouteKey.Feedback).path,
        icon: rc(RouteKey.Feedback).icon,
        label: rc(RouteKey.Feedback).name
      },
      {
        key: rc(RouteKey.Profile).path,
        icon: rc(RouteKey.Profile).icon,
        label: rc(RouteKey.Profile).name
      }
    ]
  })

  return (
    <div className={styles.siderMenu}>
      <Link to={rc(RouteKey.Dashboard).path} className={styles.logo}>
        <img
          alt="logo"
          className={classnames(styles.image, props.isSiderCollapsed && styles.collapsed)}
          src={getResourceUrl(
            props.isSiderCollapsed ? `/images/logo.mini.svg` : `/images/logo.svg`
          )}
        />
      </Link>
      <Spin spinning={admin.loading.value} size="small">
        <div className={classnames(styles.userInfo, props.isSiderCollapsed && styles.collapsed)}>
          <img
            className={styles.avatar}
            draggable={false}
            src={admin.data.avatar}
            alt={admin.data.name}
          />
          <Typography.Title level={5} className={styles.name} title={admin.data.name}>
            {admin.data.name || '-'}
          </Typography.Title>
          <Typography.Text
            className={styles.slogan}
            ellipsis={true}
            type="secondary"
            title={admin.data.slogan}
          >
            {props.isSiderCollapsed ? '...' : admin.data.slogan || '-'}
          </Typography.Text>
        </div>
      </Spin>
      <Menu
        theme="dark"
        mode="inline"
        className={styles.menus}
        onClick={(event) => navigate(event.key)}
        selectedKeys={[location.pathname]}
        defaultOpenKeys={[rc(RouteKey.Article).path]}
        items={mainMenuItems.value}
      />
      <Menu
        className={styles.footerLink}
        mode="vertical"
        selectedKeys={[]}
        items={[
          {
            key: 'github',
            icon: <Icon.GithubOutlined />,
            label: 'source-code',
            onClick: () => window.open(GITHUB_REPO_URL)
          }
        ]}
      />
    </div>
  )
}
