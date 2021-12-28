import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Dropdown, Avatar, Button, Modal, Spin } from 'antd'
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'

import { RouteKey, rc } from '@/routes'
import { removeToken } from '@/services/token'
import { AvatarType } from '@/constants/auth'
import { getGravatar } from '@/transforms/avatar'
import { useAdminState } from '@/state/admin'

import styles from './style.module.less'

interface AppHeaderProps {
  isSiderCollapsed: boolean
  onToggleSider(): void
}
export const AppHeader: React.FC<AppHeaderProps> = (props) => {
  const navigate = useNavigate()
  const admin = useAdminState()

  const redriectToProfileRoute = () => {
    navigate(rc(RouteKey.Profile).path)
  }

  const logout = () => {
    Modal.confirm({
      title: '确定要退出吗？',
      centered: true,
      onOk() {
        console.log('退出系统')
        removeToken()
        navigate(rc(RouteKey.Hello).path)
      },
    })
  }

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
        <Spin spinning={admin.loading.value} size="small">
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
                className={styles.avatar}
                src={
                  admin.data.avatar_type === AvatarType.Gravatar
                    ? getGravatar(admin.data.email)
                    : admin.data.avatar
                }
              />
            </div>
          </Dropdown>
        </Spin>
      </div>
    </div>
  )
}
