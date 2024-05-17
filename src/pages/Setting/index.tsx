/**
 * @file Global setting page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Card, Row, Col, Space } from 'antd'
import * as Icon from '@ant-design/icons'

import { useTranslation } from '@/i18n'
import { APP_LAYOUT_GUTTER_SIZE } from '@/config'
import { GeneralForm } from './General'
import { DataForm } from './Data'
import { ProfileForm } from './Profile'

interface PageCardProps extends React.PropsWithChildren {
  title: string
  icon: React.ReactNode
}

const PageCard: React.FC<PageCardProps> = (props) => {
  const title = (
    <Space size="small">
      {props.icon}
      {props.title}
    </Space>
  )

  return (
    <Card bordered={false} title={title}>
      {props.children}
    </Card>
  )
}

export const SettingPage: React.FC = () => {
  const { i18n } = useTranslation()
  return (
    <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
      <Col xs={24} lg={17}>
        <PageCard title={i18n.t('page.setting.general.title')} icon={<Icon.ControlOutlined />}>
          <GeneralForm labelSpan={4} wrapperSpan={19} />
        </PageCard>
      </Col>
      <Col xs={24} lg={7}>
        <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
          <Col span={24}>
            <PageCard
              title={i18n.t('page.setting.data.title')}
              icon={<Icon.CloudServerOutlined />}
            >
              <DataForm />
            </PageCard>
          </Col>
          <Col span={24}>
            <PageCard title={i18n.t('page.setting.userinfo.title')} icon={<Icon.UserOutlined />}>
              <ProfileForm />
            </PageCard>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
