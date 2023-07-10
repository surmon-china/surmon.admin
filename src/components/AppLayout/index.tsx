/**
 * @desc App layout
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useRef, useComputed, onMounted } from 'veact'
import { ConfigProvider, Layout, Space, Typography } from 'antd'
import * as Icon from '@ant-design/icons'
import zhCN from 'antd/lib/locale/zh_CN'

import * as CONFIG from '@/config'
import { useAdminState } from '@/state/admin'
import { AppSider } from './Sider'
import { AppHeader } from './Header'
import { AppContent } from './Content'

import styles from './style.module.less'

const INIT_ON_WEB_DEVICE = window.innerWidth >= 992

export const AppLayout: React.FC<React.PropsWithChildren> = (props) => {
  const adminState = useAdminState()
  const isSiderCollapsed = useRef(!INIT_ON_WEB_DEVICE)
  const toggleSider = () => {
    isSiderCollapsed.value = !isSiderCollapsed.value
  }

  const siderWidth = useComputed(() =>
    isSiderCollapsed.value ? CONFIG.APP_SIDER_COLLAPSED_WIDTH : CONFIG.APP_SIDER_WIDTH
  )

  onMounted(() => {
    adminState.refresh()
  })

  return (
    <ConfigProvider locale={zhCN} space={{ size: CONFIG.APP_CONTENT_SPACE_SIZE }}>
      <Layout id="app-layout" className={styles.appLayout}>
        <Layout.Sider
          trigger={null}
          collapsible={true}
          collapsed={isSiderCollapsed.value}
          className={styles.appSider}
          width={siderWidth.value}
          theme="dark"
        >
          <AppSider isSiderCollapsed={isSiderCollapsed.value} />
        </Layout.Sider>
        <Layout style={{ marginLeft: siderWidth.value, display: 'block' }}>
          <Layout.Header
            style={{ width: `calc(100% - ${siderWidth.value}px)` }}
            className={styles.appHeader}
          >
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
    </ConfigProvider>
  )
}
