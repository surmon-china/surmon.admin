import React from 'react'
import { Tooltip, Typography } from 'antd'
import { ReportRowItem } from './common/helper'
import { GoogleAnalyticsTreeList } from './common/TreeList'

export interface GoogleAnalyticsTitlesProps {
  rows: ReportRowItem[]
}

export const GoogleAnalyticsTitles: React.FC<GoogleAnalyticsTitlesProps> = (props) => {
  return (
    <GoogleAnalyticsTreeList
      rows={props.rows}
      limit={8}
      renderLabel={(item) => (
        <Tooltip placement="topLeft" title={item.name}>
          <Typography.Text style={{ maxWidth: '80%' }} ellipsis>
            {item.name}
          </Typography.Text>
        </Tooltip>
      )}
    />
  )
}
