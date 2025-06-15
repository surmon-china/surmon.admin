import React from 'react'
import { Card, Statistic, Flex, Divider, Skeleton } from 'antd'

import styles from './style.module.less'

interface StatisticCardProps extends React.PropsWithChildren {
  loading: boolean
  title: string
  suffix?: string
  value: string | number
  icon: React.ReactNode
  extra?: React.ReactNode
}

export const StatisticCard: React.FC<StatisticCardProps> = (props) => (
  <Card variant="borderless" className={styles.statisticCard}>
    <Flex justify="space-between">
      <Statistic
        valueStyle={{ fontWeight: 'bold' }}
        loading={props.loading}
        title={props.title}
        value={props.value}
        suffix={props.suffix}
      />
      <div className={styles.icon}>{props.icon}</div>
    </Flex>
    <Divider size="middle" />
    {props.loading ? <Skeleton.Input block active size="small" /> : props.extra}
  </Card>
)
