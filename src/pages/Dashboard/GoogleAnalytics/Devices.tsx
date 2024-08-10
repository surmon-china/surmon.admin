import React from 'react'
import * as Icons from '@ant-design/icons'
import { ReportRowItem } from './common/helper'
import { GoogleAnalyticsTreeList } from './common/TreeList'

const getIconByOSName = (name: string) => {
  if (name === 'Windows') return <Icons.WindowsFilled />
  if (name === 'Macintosh') return <Icons.AppleFilled />
  if (name === 'iOS') return <Icons.AppleFilled />
  if (name === 'Android') return <Icons.AndroidFilled />
  if (name === 'Linux') return <Icons.LinuxOutlined />
  if (name.includes('Chrome')) return <Icons.ChromeFilled />
  return <Icons.GlobalOutlined />
}

export interface GoogleAnalyticsDevicesProps {
  rows: ReportRowItem[]
}

export const GoogleAnalyticsDevices: React.FC<GoogleAnalyticsDevicesProps> = (props) => {
  return (
    <GoogleAnalyticsTreeList
      rows={props.rows}
      limit={8}
      childrenLimit={100}
      defaultExpanded={false}
      strongLabel
      labelPrefix={(item) => getIconByOSName(item.name)}
    />
  )
}
