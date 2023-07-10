/**
 * @file Global setting page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Card, Tabs, Typography, Space } from 'antd'
import * as Icon from '@ant-design/icons'

import { BaseForm } from './Base'
import { DataForm } from './Data'
import { AuthForm } from './Auth'
import styles from './style.module.less'

enum TabKey {
  Base = 'base',
  Auth = 'auth',
  Data = 'data'
}

const FORM_LABEL_SPAN = 4
const FORM_WRAPPER_SPAN = 14
const TABS_CONFIG = [
  {
    key: TabKey.Base,
    label: '基本设置',
    icon: <Icon.SettingOutlined />,
    pane: <BaseForm labelSpan={FORM_LABEL_SPAN} wrapperSpan={FORM_WRAPPER_SPAN} />
  },
  {
    key: TabKey.Auth,
    label: '站长资料',
    icon: <Icon.UserOutlined />,
    pane: <AuthForm labelSpan={FORM_LABEL_SPAN} wrapperSpan={FORM_WRAPPER_SPAN} />
  },
  {
    key: TabKey.Data,
    label: '数据安全',
    icon: <Icon.DatabaseOutlined />,
    pane: <DataForm labelSpan={FORM_LABEL_SPAN} wrapperSpan={FORM_WRAPPER_SPAN} />
  }
]

export const ProfilePage: React.FC = () => {
  const items = TABS_CONFIG.map((tab) => ({
    key: tab.key,
    label: (
      <>
        {tab.icon}
        {tab.label}
      </>
    ),
    children: (
      <div className={styles.tabContentCard}>
        <Typography.Title level={4} className={styles.title}>
          <Space>
            {tab.icon}
            {tab.label}
          </Space>
        </Typography.Title>
        {tab.pane}
      </div>
    )
  }))

  return (
    <Card title="系统设置" bordered={false} className={styles.profile}>
      <Tabs
        tabPosition="left"
        defaultActiveKey={TabKey.Base}
        destroyInactiveTabPane={true}
        items={items}
      />
    </Card>
  )
}
