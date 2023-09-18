import React from 'react'
import { Card, Result, Button, Space, Typography } from 'antd'
import { LineChartOutlined } from '@ant-design/icons'
import { APP_COLOR_PRIMARY } from '@/config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CHART_COLORS = [
  APP_COLOR_PRIMARY,
  '#2fc32f',
  '#b0dc0b',
  '#eab404',
  '#de672c',
  '#ec2e2e',
  '#d5429b',
  '#6f52b8',
  '#1c7cd5',
  '#56b9f7',
  '#0ae8eb'
]

export const Analytics: React.FC = () => {
  return (
    <Card
      bordered={false}
      title="Analytics"
      extra={
        <Space>
          <Button.Group>
            <Button
              href="https://developers.google.com/analytics/devguides/reporting/embed/v1/"
              target="_blank"
              rel="noreferrer"
            >
              Embed
            </Button>
            <Button
              href="https://developers.google.com/analytics/devguides/reporting/data/v1"
              target="_blank"
              rel="noreferrer"
            >
              API
            </Button>
            <Button href="https://ga-dev-tools.google/ga4/" target="_blank" rel="noreferrer">
              Tools
            </Button>
          </Button.Group>
        </Space>
      }
    >
      <Result
        icon={<LineChartOutlined style={{ color: '#ffffff59' }} />}
        title={
          <Typography.Text type="secondary">
            It's a feature to be implemented, but I'll probably never start.
          </Typography.Text>
        }
      />
    </Card>
  )
}
