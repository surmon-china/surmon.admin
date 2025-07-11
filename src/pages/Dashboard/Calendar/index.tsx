import dayjs from 'dayjs'
import React, { useMemo, useRef } from 'react'
import { Button, Card, Divider, Space } from 'antd'
import { APP_PRIMARY_COLOR } from '@/config'
import { StatisticsCalendarItem } from '@/apis/system'
import { ECharts, ChartRef, ChartOptions } from '@/components/common/Echarts'
import { getBarChartConfig } from '@/components/common/Echarts/config.bar'

const DATE_DATE_KEY_FORMAT = 'YYYY-MM-DD'
const CHART_DATE_KEY_FORMAT = 'YYYY/MM/DD'

export interface CalendarCardProps extends React.PropsWithChildren {
  title: string
  loading: boolean
  height: number
  articleData: StatisticsCalendarItem[]
  commentData: StatisticsCalendarItem[]
  cardExtra?: React.ReactElement
}

export const CalendarCard: React.FC<CalendarCardProps> = (props) => {
  const chartRef = useRef<ChartRef>(null)
  const today = useMemo<dayjs.Dayjs>(() => dayjs(), [])
  const firstDay = useMemo<dayjs.Dayjs | null>(() => {
    if (!props.articleData.length || !props.commentData.length) {
      return null
    }
    const firstArticleDay = dayjs(props.articleData[0].date)
    const firstCommentDay = dayjs(props.commentData[0].date)
    return firstArticleDay.isBefore(firstCommentDay) ? firstArticleDay : firstCommentDay
  }, [props.articleData, props.commentData])

  const chartData = useMemo(() => {
    if (!firstDay) {
      return null
    }

    // data map
    const articleDataMap = new Map(props.articleData.flatMap((item) => [[item.date, item.count]]))
    const commentDataMap = new Map(props.commentData.flatMap((item) => [[item.date, item.count]]))
    // date list
    const daysDiff = today.diff(firstDay, 'day')
    const dateList = []
    const articleCountList = []
    const commentCountList = []
    for (let i = 0; i <= daysDiff; i++) {
      const day = firstDay.add(i, 'day')
      const dataKey = day.format(DATE_DATE_KEY_FORMAT)
      const chartKey = day.format(CHART_DATE_KEY_FORMAT)
      dateList.push(chartKey)
      articleCountList.push(articleDataMap.get(dataKey) || 0)
      commentCountList.push(commentDataMap.get(dataKey) || 0)
    }

    return {
      dateList,
      articleCountList,
      commentCountList
    }
  }, [firstDay, props.articleData, props.commentData])

  const chartConfig = useMemo<ChartOptions>(() => {
    return getBarChartConfig({
      dataZoom: true,
      startValue: today.subtract(3, 'months').format(CHART_DATE_KEY_FORMAT),
      endValue: today.format(CHART_DATE_KEY_FORMAT),
      categoryData: chartData?.dateList ?? [],
      barsData: [
        {
          data: chartData?.articleCountList ?? [],
          name: 'Articles',
          color: APP_PRIMARY_COLOR
        },
        {
          data: chartData?.commentCountList ?? [],
          name: 'Comments',
          color: '#f8981d'
        }
      ]
    })
  }, [chartData])

  // https://echarts.apache.org/zh/api.html#action.dataZoom.dataZoom
  const selectAllData = () => {
    chartRef.current?.instance()?.dispatchAction({
      type: 'dataZoom',
      dataZoomIndex: 0,
      start: 0,
      end: 100
    })
  }

  const selectDataRange = (startDate: dayjs.Dayjs) => {
    chartRef.current?.instance()?.dispatchAction({
      type: 'dataZoom',
      dataZoomIndex: 0,
      startValue: startDate.format(CHART_DATE_KEY_FORMAT),
      endValue: dayjs().format(CHART_DATE_KEY_FORMAT)
    })
  }

  return (
    <Card
      variant="borderless"
      title={props.title}
      loading={props.loading}
      extra={
        <Space wrap>
          <Space.Compact size="small">
            <Button onClick={() => selectDataRange(dayjs().subtract(1, 'month'))}>
              最近一月
            </Button>
            <Button onClick={() => selectDataRange(dayjs().subtract(3, 'months'))}>
              最近三个月
            </Button>
            <Button onClick={() => selectDataRange(dayjs().subtract(1, 'year'))}>最近一年</Button>
            <Button onClick={selectAllData}>全部视图</Button>
          </Space.Compact>
          <Divider type="vertical" />
          {props.cardExtra}
        </Space>
      }
    >
      <ECharts
        ref={chartRef}
        options={chartConfig}
        style={{ width: '100%', height: props.height }}
      />
    </Card>
  )
}
