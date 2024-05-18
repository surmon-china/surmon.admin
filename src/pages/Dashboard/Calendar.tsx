import dayjs from 'dayjs'
import React, { useMemo, useRef } from 'react'
import { Button, Card, Divider, Space } from 'antd'
import { StatisticsCalendarItem } from '@/apis/system'
import { CalendarChart, ChartRef, ChartOptions } from './Chart'
import { getChartConfig } from './chartConfig'

const DATE_DATE_KEY_FORMAT = 'YYYY-MM-DD'
const CHART_DATE_KEY_FORMAT = 'YYYY/MM/DD'

export interface CalendarCardProps extends React.PropsWithChildren {
  title: string
  loading: boolean
  data: StatisticsCalendarItem[]
  cardExtra?: React.ReactElement
}

export const CalendarCard: React.FC<CalendarCardProps> = (props) => {
  const chartRef = useRef<ChartRef>(null)
  const activeDataMap = useMemo(
    () => new Map(props.data.flatMap((item) => [[item.date, item.count]])),
    [props.data]
  )

  const today = useMemo<dayjs.Dayjs>(() => dayjs(), [])
  const firstDay = useMemo<dayjs.Dayjs | null>(() => {
    return props.data.length ? dayjs(props.data[0].date) : null
  }, [props.data])

  const chartData = useMemo(() => {
    if (!firstDay) {
      return null
    }

    const daysDiff = today.diff(firstDay, 'day')
    const dateList = []
    const countList = []
    for (let i = 0; i <= daysDiff; i++) {
      const day = firstDay.add(i, 'day')
      const dataKey = day.format(DATE_DATE_KEY_FORMAT)
      const chartKey = day.format(CHART_DATE_KEY_FORMAT)
      dateList.push(chartKey)
      countList.push(activeDataMap.get(dataKey) || 0)
    }

    return { dateList, countList }
  }, [props.data])

  const chartConfig = useMemo<ChartOptions>(() => {
    return getChartConfig({
      countList: chartData?.countList ?? [],
      dateList: chartData?.dateList ?? [],
      startValue: today.subtract(3, 'months').format(CHART_DATE_KEY_FORMAT),
      endValue: today.format(CHART_DATE_KEY_FORMAT)
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
      bordered={false}
      title={props.title}
      loading={props.loading}
      extra={
        <Space wrap>
          <Button.Group size="small">
            <Button onClick={() => selectDataRange(dayjs().subtract(1, 'month'))}>
              最近一月
            </Button>
            <Button onClick={() => selectDataRange(dayjs().subtract(3, 'months'))}>
              最近三个月
            </Button>
            <Button onClick={() => selectDataRange(dayjs().subtract(1, 'year'))}>最近一年</Button>
            <Button onClick={selectAllData}>全部视图</Button>
          </Button.Group>
          <Divider type="vertical" />
          {props.cardExtra}
        </Space>
      }
    >
      <CalendarChart
        ref={chartRef}
        options={chartConfig}
        style={{ width: '100%', height: '280px' }}
      />
    </Card>
  )
}
