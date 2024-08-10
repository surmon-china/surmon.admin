import React, { useMemo } from 'react'
import { Flex, Space, Statistic } from 'antd'
import * as Icons from '@ant-design/icons'
import { APP_PRIMARY_COLOR } from '@/config'
import { ECharts, ChartOptions } from '@/components/common/Echarts'
import { getLineChartConfig } from '@/components/common/Echarts/config.line'
import { GA_DATE_RANGE_OPTIONS } from './common/config'
import { ReportRowItem } from './common/helper'

const DEFAULT_MAP_VALUE = {
  users: 0,
  views: 0,
  events: 0
}

const CHART_COLOR_MAP = {
  users: APP_PRIMARY_COLOR,
  views: 'rgba(255, 145, 0, 0.2)',
  events: 'rgba(128, 128, 128, 0.2)'
}

export interface GoogleAnalyticsOverviewProps {
  rows: ReportRowItem[]
  activeDateRange: string
  chartHeight: number
}

export const GoogleAnalyticsOverview: React.FC<GoogleAnalyticsOverviewProps> = (props) => {
  const dateRangeConfig = useMemo(
    () => GA_DATE_RANGE_OPTIONS.find((item) => item.value === props.activeDateRange)!.chartConfig,
    [props.activeDateRange]
  )

  const chartXAxisList = useMemo(() => dateRangeConfig.xAxisList(), [dateRangeConfig])
  const dataSet = useMemo(() => {
    let totalUsers = 0
    let totalViews = 0
    let totalEvents = 0
    const map = new Map(chartXAxisList.map((key) => [key, { ...DEFAULT_MAP_VALUE }]))
    props.rows.forEach((item) => {
      const key = item.dimensionValues[0].value
      const [us, vs, es] = item.metricValues.map((v) => Number(v.value))
      // for data map
      const mapItem = map.get(key) ?? { ...DEFAULT_MAP_VALUE }
      mapItem.users += us
      mapItem.views += vs
      mapItem.events += es
      map.set(key, mapItem)
      // for data set
      totalUsers += us
      totalViews += vs
      totalEvents += es
    })
    return { totalUsers, totalViews, totalEvents, map }
  }, [chartXAxisList, props.rows])

  const chartConfig = useMemo<ChartOptions>(() => {
    const mapValues = [...dataSet.map.values()]
    const usersDataList: number[] = mapValues.map((v) => v.users)
    const viewsDataList: number[] = mapValues.map((v) => v.views)
    const eventsDataList: number[] = mapValues.map((v) => v.events)
    return getLineChartConfig({
      xLabelFormatter: dateRangeConfig.xLabelFormatter,
      tooltipLabelFormatter: dateRangeConfig.tooltipLabelFormatter,
      categoryData: chartXAxisList,
      linesData: [
        {
          data: usersDataList,
          name: 'Active Users',
          zIndex: 3,
          color: CHART_COLOR_MAP.users
        },
        {
          data: viewsDataList,
          name: 'Page Views',
          zIndex: 2,
          color: CHART_COLOR_MAP.views
        }
        // {
        //   data: eventsDataList,
        //   name: 'Event Count',
        //   zIndex: 1,
        //   color: CHART_COLOR_MAP.events
        // }
      ]
    })
  }, [dataSet])

  return (
    <Flex gap="large">
      <ECharts options={chartConfig} style={{ width: '100%', height: props.chartHeight }} />
      <Space direction="vertical" size="small" style={{ width: 120 }}>
        <Statistic
          value={dataSet.totalUsers}
          title={
            <Flex justify="space-between">
              <span>Active Users</span>
              <Icons.BorderOutlined style={{ color: CHART_COLOR_MAP.users }} />
            </Flex>
          }
        />
        <Statistic
          value={dataSet.totalViews}
          title={
            <Flex justify="space-between">
              <span>Page Views</span>
              <Icons.BorderOutlined style={{ color: CHART_COLOR_MAP.views }} />
            </Flex>
          }
        />
        <Statistic
          value={dataSet.totalEvents}
          title={
            <Flex justify="space-between">
              <span>Event Count</span>
              <Icons.BorderOutlined style={{ color: CHART_COLOR_MAP.events }} />
            </Flex>
          }
        />
      </Space>
    </Flex>
  )
}
