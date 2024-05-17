import dayjs from 'dayjs'
import React, { useMemo, useRef } from 'react'
import { Button, Card, Divider, Space } from 'antd'
import { APP_PRIMARY_COLOR } from '@/config'
import { StatisticsCalendarItem } from '@/apis/system'
import { CalendarChart, ChartRef, ChartOptions } from './Chart'

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

    return {
      dateList,
      countList
    }
  }, [props.data])

  const chartDataZoomInitValueRange = useMemo(() => {
    return {
      startValue: today.subtract(3, 'months').format(CHART_DATE_KEY_FORMAT),
      endValue: today.format(CHART_DATE_KEY_FORMAT)
    }
  }, [])

  const chartConfig = useMemo<ChartOptions>(
    () => ({
      grid: {
        show: true,
        top: '6',
        left: '0',
        right: '0',
        borderWidth: 0,
        containLabel: true
      },
      series: [
        {
          type: 'bar',
          name: 'Count',
          data: chartData?.countList ?? [],
          itemStyle: {
            color: APP_PRIMARY_COLOR
          }
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: chartData?.dateList ?? [],
          axisTick: {
            lineStyle: {
              color: 'var(--app-color-text-quaternary)'
            }
          },
          axisLine: {
            lineStyle: {
              color: 'var(--app-color-text-quaternary)'
            }
          },
          axisLabel: {
            fontFamily: 'inherit',
            color: 'var(--app-color-text-secondary)'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          minInterval: 1,
          axisLabel: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'var(--app-color-border-secondary)'
            }
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        confine: true,
        borderWidth: 0,
        backgroundColor: 'var(--app-color-bg-spotlight)',
        textStyle: {
          fontWeight: 'bolder',
          fontFamily: 'inherit',
          color: 'var(--app-color-text-light-solid)'
        },
        shadowStyle: {
          color: 'var(--app-color-fill-secondary)'
        },
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
            margin: 24,
            fontFamily: 'inherit',
            fontWeight: 'bolder',
            color: '#fff',
            backgroundColor: APP_PRIMARY_COLOR
          }
        }
      },
      dataZoom: [
        {
          type: 'inside',
          startValue: chartDataZoomInitValueRange.startValue,
          endValue: chartDataZoomInitValueRange.endValue
        },
        {
          show: true,
          brushSelect: false,
          startValue: chartDataZoomInitValueRange.startValue,
          endValue: chartDataZoomInitValueRange.endValue,
          borderColor: 'var(--app-color-border-secondary)',
          fillerColor: 'var(--app-color-split)',
          dataBackground: {
            lineStyle: {
              color: 'var(--app-color-primary-border)'
            }
          },
          selectedDataBackground: {
            areaStyle: {
              color: 'var(--app-color-primary)'
            },
            lineStyle: {
              color: 'var(--app-color-primary)'
            }
          },
          handleStyle: {
            color: 'var(--app-color-bg-base)',
            borderColor: 'var(--app-color-text-quaternary)'
          },
          left: 2,
          right: 6,
          bottom: 0,
          height: 36,
          textStyle: {
            fontWeight: 'bolder',
            fontFamily: 'inherit',
            color: 'var(--app-color-text-secondary)'
          }
        }
      ]
    }),
    [chartData]
  )

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
        <Space>
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
        style={{
          width: '100%',
          height: '280px'
        }}
      />
    </Card>
  )
}
