import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown, Avatar, Button, Modal, Spin } from 'antd'
import * as Icon from '@ant-design/icons'

import { RouteKey, rc } from '@/routes'
import { removeToken } from '@/services/token'
import { useAdminState } from '@/state/admin'

import styles from './style.module.less'

interface AppHeaderProps {
  isSiderCollapsed: boolean
  onToggleSider(): void
}
export const AppHeader: React.FC<AppHeaderProps> = (props) => {
  const navigate = useNavigate()
  const adminState = useAdminState()

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
      }
    })
  }

  return (
    <div className={styles.headerContent}>
      <div className={styles.left}>
        <Button
          className={styles.siderToggler}
          type="link"
          onClick={props.onToggleSider}
          icon={React.createElement(
            props.isSiderCollapsed ? Icon.MenuUnfoldOutlined : Icon.MenuFoldOutlined,
            {
              className: 'trigger'
            }
          )}
        ></Button>
      </div>
      <div className={styles.user}>
        <Spin spinning={adminState.loading.value} size="small">
          <Dropdown
            placement="bottomRight"
            menu={{
              items: [
                {
                  key: 'profile',
                  icon: <Icon.SettingOutlined />,
                  label: '系统设置',
                  onClick: redriectToProfileRoute
                },
                {
                  key: 'divider',
                  type: 'divider'
                },
                {
                  key: 'logout',
                  icon: <Icon.LogoutOutlined />,
                  label: '退出登录',
                  danger: true,
                  onClick: logout
                }
              ]
            }}
          >
            <div className={styles.content}>
              <span>{adminState.data.name}</span>
              <Avatar
                shape="square"
                size="small"
                icon={<Icon.UserOutlined />}
                className={styles.avatar}
                src={adminState.data.avatar}
              />
            </div>
          </Dropdown>
        </Spin>
      </div>
    </div>
  )
}
