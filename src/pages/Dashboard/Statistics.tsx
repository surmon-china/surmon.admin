import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Statistic, Flex, Divider, Skeleton, Rate, Typography } from 'antd'
import * as Icon from '@ant-design/icons'
import { Statistics } from '@/apis/system'
import { RoutesKey, RoutesPath } from '@/routes'
import { numberToKilo } from '@/transforms/number'

import styles from './style.module.less'

interface StatisticCardProps extends React.PropsWithChildren {
  loading: boolean
  title: string
  suffix?: string
  value: string | number
  icon: React.ReactNode
  extra?: React.ReactNode
}

const StatisticCard: React.FC<StatisticCardProps> = (props) => (
  <Card bordered={false} className={styles.statisticCard}>
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
    <Divider className={styles.divider} />
    {props.loading ? <Skeleton.Input block active size="small" /> : props.extra}
  </Card>
)

export const getStatisticsCards = (statistics: Statistics | null, loading: boolean) => {
  return [
    <StatisticCard
      loading={loading}
      title="今日阅读"
      value={statistics?.todayViews ?? '-'}
      suffix="次"
      icon={<Icon.EyeOutlined />}
      extra={
        <Flex justify="space-between">
          <Typography.Text type="secondary">
            累计阅读 <strong>{numberToKilo(statistics?.totalViews ?? 0)}</strong>
          </Typography.Text>
          <Link className={styles.link} to={RoutesPath[RoutesKey.ArticlePost]}>
            <Icon.EditOutlined /> 写文章
          </Link>
        </Flex>
      }
    />,
    <StatisticCard
      loading={loading}
      title="全站评论"
      value={statistics?.comments ?? '-'}
      suffix="条"
      icon={<Icon.CommentOutlined />}
      extra={
        <Flex justify="space-between" align="center">
          <Link className={styles.link} to={RoutesPath[RoutesKey.Comment]}>
            管理评论
          </Link>
          <Divider type="vertical" />
          <Link className={styles.link} to={RoutesPath[RoutesKey.Comment] + '?post_id=0'}>
            查看留言
          </Link>
        </Flex>
      }
    />,
    <StatisticCard
      loading={loading}
      title="累计获得喜欢"
      value={statistics?.totalLikes ?? '-'}
      suffix="次"
      icon={<Icon.HeartOutlined />}
      extra={
        <Flex justify="space-between">
          <Rate count={5} disabled allowHalf value={statistics?.averageEmotion} />
          <Link className={styles.link} to={RoutesPath[RoutesKey.Feedback]}>
            站点反馈
          </Link>
        </Flex>
      }
    />,
    <StatisticCard
      loading={loading}
      title="共发布文章"
      value={statistics?.articles ?? '-'}
      suffix="篇"
      icon={<Icon.CoffeeOutlined />}
      extra={
        <Flex justify="space-between">
          <Typography.Text type="secondary">
            创建 <strong>{statistics?.tags ?? '-'}</strong> 个文章标签
          </Typography.Text>
          <Link className={styles.link} to={RoutesPath[RoutesKey.Tag]}>
            管理标签
          </Link>
        </Flex>
      }
    />
  ]
}
