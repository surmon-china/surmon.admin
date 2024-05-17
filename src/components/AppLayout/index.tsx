/**
 * @desc App page layout
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useRef, onMounted } from 'veact'
import { Layout, Space, Typography, Breakpoint, theme } from 'antd'
import * as Icon from '@ant-design/icons'
import { useAdminProfile } from '@/contexts/AdminProfile'
import { AppSider } from './Sider'
import { AppHeader } from './Header'
import { AppContent } from './Content'

import styles from './style.module.less'

const SIDER_BREAKPOINT_TOKEN: Breakpoint = 'xl'
const SCREEN_XL_PX = theme.getDesignToken().screenXL
const INIT_SIDER_COLLAPSED_STATE = window.innerWidth >= SCREEN_XL_PX

export const AppLayout: React.FC<React.PropsWithChildren> = (props) => {
  const adminProfile = useAdminProfile()
  const isSiderCollapsed = useRef(!INIT_SIDER_COLLAPSED_STATE)
  const toggleSider = () => {
    isSiderCollapsed.value = !isSiderCollapsed.value
  }

  onMounted(() => {
    adminProfile.refresh()
  })

  return (
    <Layout id="app-layout" className={styles.appLayout}>
      <Layout.Sider
        className={styles.appSider}
        trigger={null}
        collapsible={true}
        collapsed={isSiderCollapsed.value}
        breakpoint={SIDER_BREAKPOINT_TOKEN}
        onBreakpoint={(isSmallerThanBreakpoint) => {
          isSiderCollapsed.value = isSmallerThanBreakpoint
        }}
      >
        <AppSider isSiderCollapsed={isSiderCollapsed.value} />
      </Layout.Sider>
      <Layout>
        <Layout.Header className={styles.appHeader}>
          <AppHeader isSiderCollapsed={isSiderCollapsed.value} onToggleSider={toggleSider} />
        </Layout.Header>
        <Layout.Content className={styles.appContent}>
          <AppContent>{props?.children}</AppContent>
        </Layout.Content>
        <Layout.Footer className={styles.appFooter}>
          <Space size="small">
            <Icon.CodeOutlined />
            Powered by
            <Typography.Link target="_blank" href="https://github.com/facebook/react">
              React
            </Typography.Link>
            &
            <Typography.Link target="_blank" href="https://github.com/veactjs/veact">
              Veact
            </Typography.Link>
          </Space>
        </Layout.Footer>
      </Layout>
    </Layout>
  )
}
