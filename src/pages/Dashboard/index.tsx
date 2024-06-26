/**
 * @file Dashboard page
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useMemo, useState } from 'react'
import { onMounted } from 'veact'
import { Space, Row, Col, Select, Card, Result } from 'antd'
import * as Icons from '@ant-design/icons'
import { useLoading } from '@/enhancers/useLoading'
import { APP_LAYOUT_SPACE_SIZE, APP_LAYOUT_GUTTER_SIZE } from '@/config'
import { StatisticsCalendarItem, getArticleCalendar, getCommentCalendar } from '@/apis/system'
import { Statistics, getStatistics } from '@/apis/system'
import { getStatisticsCards } from './Statistics'
import { CalendarCard } from './Calendar'

import styles from './style.module.less'

export enum CalendarDataKey {
  Article = 'article',
  Comment = 'comment'
}

const calendarDataOptions = [
  {
    value: CalendarDataKey.Comment,
    icon: <Icons.CommentOutlined />,
    text: '评论'
  },
  {
    value: CalendarDataKey.Article,
    icon: <Icons.CoffeeOutlined />,
    text: '文章'
  }
]

export const DashboardPage: React.FC = () => {
  const statisticsFetching = useLoading()
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const fetchStatistics = () => {
    statisticsFetching.promise(getStatistics()).then((result) => {
      setStatistics(result)
    })
  }

  const articleCalendarFetching = useLoading()
  const [articleCalendar, setArticleCalendar] = useState<StatisticsCalendarItem[]>([])
  const fetchArticleCalendar = async () => {
    setArticleCalendar(await articleCalendarFetching.promise(getArticleCalendar()))
  }

  const commentCalendarFetching = useLoading()
  const [commentCalendar, setCommentCalendar] = useState<StatisticsCalendarItem[]>([])
  const fetchCommentCalendar = async () => {
    setCommentCalendar(await commentCalendarFetching.promise(getCommentCalendar()))
  }

  const [activeCalendarDataKey, setActiveCalendarDataKey] = useState<CalendarDataKey>(
    CalendarDataKey.Comment
  )
  const activeCalendarData = useMemo(
    () => (activeCalendarDataKey === CalendarDataKey.Article ? articleCalendar : commentCalendar),
    [activeCalendarDataKey, articleCalendar, commentCalendar]
  )

  const statisticsCardsElements = useMemo(() => {
    return getStatisticsCards(statistics!, statisticsFetching.state)
  }, [statistics, statisticsFetching.state])

  onMounted(() => {
    fetchStatistics()
    fetchArticleCalendar()
    fetchCommentCalendar()
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
            data={activeCalendarData}
            loading={articleCalendarFetching.state || commentCalendarFetching.state}
            cardExtra={
              <Select
                size="small"
                value={activeCalendarDataKey}
                onChange={(value) => setActiveCalendarDataKey(value)}
                options={calendarDataOptions.map((option) => ({
                  value: option.value,
                  label: (
                    <Space size="small">
                      {option.icon}
                      {option.text}
                    </Space>
                  )
                }))}
              />
            }
          />
        </Col>
      </Row>
      <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
        <Col xs={12}>
          <Card bordered={false} title="Analytics">
            <Result
              icon={<Icons.StockOutlined style={{ color: 'var(--app-color-text-quaternary)' }} />}
            />
          </Card>
        </Col>
        <Col xs={12}>
          <Card bordered={false} title="PieChart">
            <Result
              icon={
                <Icons.PieChartOutlined style={{ color: 'var(--app-color-text-quaternary)' }} />
              }
            />
          </Card>
        </Col>
      </Row>
    </Space>
  )
}
