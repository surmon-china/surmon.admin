/**
 * @file Global setting page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react';
import { Card, Tabs, Typography, Space } from 'antd';
import { SettingOutlined, UserOutlined, DatabaseOutlined } from '@ant-design/icons';

import { BaseForm } from './Base';
import { DataForm } from './Data';
import { AuthForm } from './Auth';
import styles from './style.module.less';

const FormCard: React.FC<{ title: React.ReactElement }> = (props) => (
  <div className={styles.formCard}>
    <Typography.Title level={4} className={styles.title}>
      {props.title}
    </Typography.Title>
    {props.children}
  </div>
);

enum TabKey {
  Base = 'base',
  Auth = 'auth',
  Data = 'data',
}

const FORM_LABEL_SPAN = 4;
const FORM_WRAPPER_SPAN = 12;
const TabsConfig = [
  {
    key: TabKey.Base,
    name: '基本设置',
    icon: <SettingOutlined />,
    form: <BaseForm labelSpan={FORM_LABEL_SPAN} wrapperSpan={FORM_WRAPPER_SPAN} />,
  },
  {
    key: TabKey.Auth,
    name: '个人设置',
    icon: <UserOutlined />,
    form: <AuthForm labelSpan={FORM_LABEL_SPAN} wrapperSpan={FORM_WRAPPER_SPAN} />,
  },
  {
    key: TabKey.Data,
    name: '数据安全',
    icon: <DatabaseOutlined />,
    form: <DataForm labelSpan={FORM_LABEL_SPAN} wrapperSpan={FORM_WRAPPER_SPAN} />,
  },
];

export const ProfilePage: React.FC = () => {
  return (
    <Card title="系统设置" bordered={false} className={styles.profile}>
      <Tabs
        defaultActiveKey={TabKey.Base}
        tabPosition="left"
        destroyInactiveTabPane={true}
      >
        {TabsConfig.map((tabConfig) => (
          <Tabs.TabPane
            key={tabConfig.key}
            tab={
              <span>
                {tabConfig.icon}
                {tabConfig.name}
              </span>
            }
          >
            <FormCard
              title={
                <Space>
                  {tabConfig.icon}
                  {tabConfig.name}
                </Space>
              }
            >
              {tabConfig.form}
            </FormCard>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Card>
  );
};
