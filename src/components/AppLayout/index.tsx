/**
 * @desc App layout
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react';
import { useRef, useComputed, onMounted } from '@/veact';
import { ConfigProvider, Layout } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import * as CONFIG from '@/config';
import { AppSider } from './Sider';
import { AppHeader } from './Header';
import { AppContent } from './Content';
import { adminState } from '@/state/admin';

import styles from './style.module.less';

export const AppLayout: React.FC = (props) => {
  const isSiderCollapsed = useRef(false);
  const toggleSider = () => {
    isSiderCollapsed.value = !isSiderCollapsed.value;
  };

  const siderWidth = useComputed(() =>
    isSiderCollapsed.value ? CONFIG.APP_SIDER_COLLAPSED_WIDTH : CONFIG.APP_SIDER_WIDTH
  );

  onMounted(() => {
    adminState.refresh();
  });

  return (
    <ConfigProvider locale={zhCN} space={{ size: CONFIG.APP_CONTENT_SPACE_SIZE }}>
      <Layout id="app-layout" className={styles.appLayout}>
        <Layout.Sider
          trigger={null}
          collapsible={true}
          collapsed={isSiderCollapsed.value}
          className={styles.appSider}
          width={siderWidth.value}
        >
          <AppSider isSiderCollapsed={isSiderCollapsed.value} />
        </Layout.Sider>
        <Layout style={{ marginLeft: siderWidth.value, display: 'block' }}>
          <Layout.Header
            style={{ width: `calc(100% - ${siderWidth.value}px)` }}
            className={styles.appHeader}
          >
            <AppHeader
              isSiderCollapsed={isSiderCollapsed.value}
              onToggleSider={toggleSider}
            />
          </Layout.Header>
          <Layout.Content className={styles.appContent}>
            <AppContent>{props?.children}</AppContent>
          </Layout.Content>
          <Layout.Footer className={styles.appFooter}>
            Build by ❤️ 🏳️‍🌈 🏳️‍⚧️ ⚧ ☮️ 🎈 🤘
          </Layout.Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
