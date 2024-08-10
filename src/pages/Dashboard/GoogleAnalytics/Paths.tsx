import React from 'react'
import { Tooltip, Typography, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { getBlogUrl } from '@/transforms/url'
import { ReportRowItem } from './common/helper'
import { GoogleAnalyticsTreeList } from './common/TreeList'

export interface GoogleAnalyticsPathsProps {
  rows: ReportRowItem[]
}

export const GoogleAnalyticsPaths: React.FC<GoogleAnalyticsPathsProps> = (props) => {
  return (
    <GoogleAnalyticsTreeList
      rows={props.rows}
      limit={8}
      renderLabel={(item) => (
        <Tooltip placement="topLeft" title={getBlogUrl(item.name)}>
          <Typography.Link href={getBlogUrl(item.name)} target="_blank">
            <Space size="small">
              <Icons.LinkOutlined />
              {item.name}
            </Space>
          </Typography.Link>
        </Tooltip>
      )}
    />
  )
}
