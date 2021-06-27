import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { Menu, Spin } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

import * as CONFIG from '@/config';
import { RouteKey, routeMap, rc } from '@/route';
import { useAdminState } from '@/state/admin';

import styles from './style.module.less';

export interface AppSiderProps {
  isSiderCollapsed: boolean;
}
export const AppSider: React.FC<AppSiderProps> = (props) => {
  const history = useHistory();
  const location = useLocation();
  const admin = useAdminState();

  return (
    <div className={styles.siderMenu}>
      <Link to={rc(RouteKey.Dashboard).path} className={styles.logo}>
        <img
          alt="logo"
          src={props.isSiderCollapsed ? '/images/logo.mini.svg' : '/images/logo.svg'}
          className={classnames(
            styles.image,
            props.isSiderCollapsed && styles.collapsed
          )}
        />
      </Link>
      <Spin spinning={admin.loading} size="small">
        <div className={styles.userInfo}>
          <img
            src={admin.data.gravatar}
            alt={admin.data.name}
            draggable={false}
            className={classnames(
              styles.gravatar,
              props.isSiderCollapsed && styles.collapsed
            )}
          />
          {!props.isSiderCollapsed && (
            <>
              <span className={styles.name}>{admin.data.name}</span>
              <span className={styles.slogan}>{admin.data.slogan}</span>
            </>
          )}
        </div>
      </Spin>
      <Menu
        theme="dark"
        mode="inline"
        className={styles.menus}
        onClick={(event) => history.push(event.key)}
        selectedKeys={[location.pathname]}
        defaultOpenKeys={Array.from(routeMap.values()).map((route) => route.path)}
      >
        <Menu.Item key={rc(RouteKey.Dashboard).path} icon={rc(RouteKey.Dashboard).icon}>
          {rc(RouteKey.Dashboard).name}
        </Menu.Item>
        <Menu.Item
          key={rc(RouteKey.Announcement).path}
          icon={rc(RouteKey.Announcement).icon}
        >
          {rc(RouteKey.Announcement).name}
        </Menu.Item>
        <Menu.Item key={rc(RouteKey.Category).path} icon={rc(RouteKey.Category).icon}>
          {rc(RouteKey.Category).name}
        </Menu.Item>
        <Menu.Item key={rc(RouteKey.Tag).path} icon={rc(RouteKey.Tag).icon}>
          {rc(RouteKey.Tag).name}
        </Menu.Item>
        <Menu.Item
          key={rc(RouteKey.Comment).path}
          icon={rc(RouteKey.Comment).icon}
          title={rc(RouteKey.Comment).name}
        >
          {rc(RouteKey.Comment).name}
        </Menu.Item>
        <Menu.SubMenu
          key={rc(RouteKey.Article).path}
          icon={rc(RouteKey.Article).icon}
          title={rc(RouteKey.Article).name}
        >
          <Menu.Item key={rc(RouteKey.ArticlePost).path}>
            {rc(RouteKey.ArticlePost).name}
          </Menu.Item>
          <Menu.Item key={rc(RouteKey.ArticleList).path}>
            {rc(RouteKey.ArticleList).name}
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key={rc(RouteKey.Profile).path} icon={rc(RouteKey.Profile).icon}>
          {rc(RouteKey.Profile).name}
        </Menu.Item>
      </Menu>
      <Menu className={styles.footerLink} mode="vertical" selectedKeys={[]}>
        <Menu.Item
          key="github"
          icon={<GithubOutlined />}
          onClick={() => window.open(CONFIG.GITHUB_REPO_URL)}
        >
          {CONFIG.GITHUB_REPO_NAME}
        </Menu.Item>
      </Menu>
    </div>
  );
};
