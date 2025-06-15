/**
 * @file Global setting page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Card, Row, Col, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { useTranslation } from '@/i18n'
import { APP_LAYOUT_GUTTER_SIZE } from '@/config'
import { GeneralForm } from './General'
import { ActionsForm } from './Actions'
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
    <Card variant="borderless" title={title}>
      {props.children}
    </Card>
  )
}

export const SettingPage: React.FC = () => {
  const { i18n } = useTranslation()
  return (
    <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
      <Col xs={24} lg={17}>
        <PageCard title={i18n.t('page.setting.general.title')} icon={<Icons.ControlOutlined />}>
          <GeneralForm labelSpan={4} wrapperSpan={19} />
        </PageCard>
      </Col>
      <Col xs={24} lg={7}>
        <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
          <Col span={24}>
            <PageCard
              title={i18n.t('page.setting.data.title')}
              icon={<Icons.CloudServerOutlined />}
            >
              <ActionsForm />
            </PageCard>
          </Col>
          <Col span={24}>
            <PageCard title={i18n.t('page.setting.userinfo.title')} icon={<Icons.UserOutlined />}>
              <ProfileForm />
            </PageCard>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
