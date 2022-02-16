/**
 * @file Dashboard page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Space } from 'antd'
import { APP_LAYOUT_SPACE_SIZE } from '@/config'
import { StatisticsComponent } from './Statistics'
import { Calendar } from './Calendar'
import { Analytics } from './Analytics'

import styles from './style.module.less'

export const DashboardPage: React.FC = () => {
  return (
    <Space
      direction="vertical"
      size={APP_LAYOUT_SPACE_SIZE}
      className={styles.dashboard}
    >
      <StatisticsComponent />
      <Calendar />
      <Analytics />
    </Space>
  )
}
