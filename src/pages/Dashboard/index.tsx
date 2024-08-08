/**
 * @file Dashboard page
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useMemo, useState } from 'react'
import { onMounted } from 'veact'
import { Space, Row, Col, Button, Card } from 'antd'
import * as Icons from '@ant-design/icons'
import { useLoading } from '@/enhancers/useLoading'
import { APP_LAYOUT_SPACE_SIZE, APP_LAYOUT_GUTTER_SIZE } from '@/config'
import { StatisticsCalendarItem, getArticleCalendar, getCommentCalendar } from '@/apis/system'
import { Statistics, getStatistics } from '@/apis/system'
import { getStatisticsCards } from './Statistics'
import { CalendarCard } from './Calendar'
import { GoogleAnalytics } from './GoogleAnalytics'
import { GoogleAnalyticsRealtime } from './GoogleAnalytics/Realtime'

import styles from './style.module.less'

export const DashboardPage: React.FC = () => {
  const calendarFetching = useLoading()
  const [articleCalendar, setArticleCalendar] = useState<StatisticsCalendarItem[]>([])
  const [commentCalendar, setCommentCalendar] = useState<StatisticsCalendarItem[]>([])
  const fetchCalendarData = async () => {
    const request = Promise.all([getArticleCalendar(), getCommentCalendar()])
    const [articleData, commentData] = await calendarFetching.promise(request)
    setArticleCalendar(articleData)
    setCommentCalendar(commentData)
  }

  const statisticsFetching = useLoading()
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const fetchStatistics = () => {
    statisticsFetching.promise(getStatistics()).then((result) => {
      setStatistics(result)
    })
  }

  const statisticsCardsElements = useMemo(() => {
    return getStatisticsCards(statistics!, statisticsFetching.state)
  }, [statistics, statisticsFetching.state])

  onMounted(() => {
    fetchStatistics()
    fetchCalendarData()
  })

  return (
    <Space direction="vertical" size={APP_LAYOUT_SPACE_SIZE} className={styles.dashboardPage}>
      <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
        {statisticsCardsElements.map((statisticsCard, index) => (
          <Col xs={24} md={12} lg={6} key={index}>
            {statisticsCard}
          </Col>
        ))}
      </Row>
      <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
        <Col xs={24}>
          <CalendarCard
            title="日历纵览"
            height={220}
            articleData={articleCalendar}
            commentData={commentCalendar}
            loading={calendarFetching.state}
            cardExtra={
              <Button
                size="small"
                loading={calendarFetching.state}
                icon={<Icons.ReloadOutlined />}
                onClick={() => fetchCalendarData()}
              />
            }
          />
        </Col>
      </Row>
      <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
        <Col xs={16}>
          <Card bordered={false} title="GoogleAnalytics Overview">
            <GoogleAnalytics />
          </Card>
        </Col>
        <Col xs={8}>
          <Card bordered={false} title="GoogleAnalytics Realtime">
            <GoogleAnalyticsRealtime />
          </Card>
        </Col>
      </Row>
      <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
        <Col xs={12}>
          <Card bordered={false} title="GoogleAnalytics Countries">
            国家分类
          </Card>
        </Col>
        <Col xs={6}>
          <Card bordered={false} title="GoogleAnalytics Cities">
            城市分类
          </Card>
        </Col>
        <Col xs={6}>
          <Card bordered={false} title="GoogleAnalytics Pages">
            页面分类
          </Card>
        </Col>
      </Row>
    </Space>
  )
}
