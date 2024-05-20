/**
 * @desc App page layout
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useState } from 'react'
import { onMounted } from 'veact'
import { Layout, Space, Typography, Breakpoint, theme } from 'antd'
import * as Icons from '@ant-design/icons'
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
  const [isSiderCollapsed, setSiderCollapsed] = useState(!INIT_SIDER_COLLAPSED_STATE)
  const toggleSiderCollapsed = () => setSiderCollapsed(!isSiderCollapsed)

  onMounted(() => {
    adminProfile.refresh()
  })

  return (
    <Layout id="app-layout" className={styles.appLayout}>
      <Layout.Sider
        className={styles.appSider}
        trigger={null}
        collapsible={true}
        collapsed={isSiderCollapsed}
        breakpoint={SIDER_BREAKPOINT_TOKEN}
        onBreakpoint={(isSmallerThanBreakpoint) => setSiderCollapsed(isSmallerThanBreakpoint)}
      >
        <AppSider isSiderCollapsed={isSiderCollapsed} />
      </Layout.Sider>
      <Layout>
        <Layout.Header className={styles.appHeader}>
          <AppHeader isSiderCollapsed={isSiderCollapsed} onToggleSider={toggleSiderCollapsed} />
        </Layout.Header>
        <Layout.Content className={styles.appContent}>
          <AppContent>{props?.children}</AppContent>
        </Layout.Content>
        <Layout.Footer className={styles.appFooter}>
          <Space size="small">
            <Icons.CodeOutlined />
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
