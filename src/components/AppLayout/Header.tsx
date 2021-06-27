import React from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Dropdown, Avatar, Button, Modal, Spin } from 'antd';
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

import { RouteKey, rc } from '@/route';
import { removeToken } from '@/services/token';
import { useAdminState } from '@/state/admin';

import styles from './style.module.less';

interface AppHeaderProps {
  isSiderCollapsed: boolean;
  onToggleSider(): void;
}
export const AppHeader: React.FC<AppHeaderProps> = (props) => {
  const history = useHistory();
  const admin = useAdminState();

  const redriectToProfileRoute = () => {
    history.push(rc(RouteKey.Profile).path);
  };

  const logout = () => {
    Modal.confirm({
      title: '确定要退出吗？',
      centered: true,
      onOk() {
        console.log('退出系统');
        removeToken();
        history.push(rc(RouteKey.Who).path);
      },
    });
  };

  return (
    <div className={styles.headerContent}>
      <div className={styles.toggler}>
        <Button
          type="link"
          onClick={props.onToggleSider}
          icon={React.createElement(
            props.isSiderCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
            }
          )}
        ></Button>
      </div>
      <div className={styles.user}>
        <Spin spinning={admin.loading} size="small">
          <Dropdown
            placement="bottomRight"
            overlay={
              <Menu>
                <Menu.Item
                  icon={<SettingOutlined />}
                  key="profile"
                  onClick={redriectToProfileRoute}
                >
                  系统设置
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  icon={<LogoutOutlined />}
                  onClick={logout}
                  key="logout"
                  danger
                >
                  退出登录
                </Menu.Item>
              </Menu>
            }
          >
            <div className={styles.content}>
              <span>{admin.data.name}</span>
              <Avatar
                shape="square"
                size="small"
                icon={<UserOutlined />}
                className={styles.gravatar}
                src={admin.data.gravatar}
              />
            </div>
          </Dropdown>
        </Spin>
      </div>
    </div>
  );
};
