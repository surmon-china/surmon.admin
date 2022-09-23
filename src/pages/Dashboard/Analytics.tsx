import moment from 'moment'
import React from 'react'
import classnames from 'classnames'
import { useRef, useShallowRef, onMounted, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Card, Divider, Button, Spin, Space, DatePicker } from 'antd'
import * as Icon from '@ant-design/icons'
import { APP_COLOR_PRIMARY } from '@/config'
import { getGAToken } from '@/store/system'
import styles from './style.module.less'

// @ts-ignore
import { loadScript } from './analytics-loader.js'

const GOOGLE_CHART_VIEW_SELECTOR_ID = 'view-selector'
const GOOGLE_CHART_TIMELINE_ID = 'timeline'
const GOOGLE_CHART_ID_MAP = {
  COUNTRY: 'country',
  CITY: 'city',
  BROWSER: 'browser',
  OS: 'os',
}

const GOOGLE_CHART_BG_OPACITY = 0.05
const GOOGLE_CHART_COLORS = [
  APP_COLOR_PRIMARY,
  '#2fc32f',
  '#b0dc0b',
  '#eab404',
  '#de672c',
  '#ec2e2e',
  '#d5429b',
  '#6f52b8',
  '#1c7cd5',
  '#56b9f7',
  '#0ae8eb',
]

export const Analytics: React.FC = () => {
  const isShowSelectView = useRef(true)
  const loading = useLoading()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const rerenderAnalytics = useShallowRef<any>(() => {})
  const chartDate = useShallowRef<moment.Moment | null>(null)
  const stringChartDate = useComputed(() => {
    if (chartDate.value) {
      const formated = chartDate.value.format('YYYY-MM-DD')
      const today = moment().format('YYYY-MM-DD')
      return formated === today ? 'today' : formated
    } else {
      return 'today'
    }
  })

  const handleToggleShow = () => {
    isShowSelectView.value = !isShowSelectView.value
  }

  const initAnalytics = async (accessToken: string, date: string) => {
    return new Promise<(query: any) => void>((resolve) => {
      const gapi = (window as any).gapi
      gapi.analytics.ready(() => {
        // 服务端授权立即生效，无需事件处理
        gapi.analytics.auth.authorize({
          serverAuth: { access_token: accessToken },
        })

        const viewSelector = new gapi.analytics.ViewSelector({
          container: GOOGLE_CHART_VIEW_SELECTOR_ID,
        })
        viewSelector.execute()

        const timeline = new gapi.analytics.googleCharts.DataChart({
          reportType: 'ga',
          query: {
            dimensions: 'ga:hour',
            metrics: 'ga:sessions',
            'start-date': date,
            'end-date': date,
          },
          chart: {
            type: 'LINE',
            container: GOOGLE_CHART_TIMELINE_ID,
            options: {
              colors: GOOGLE_CHART_COLORS,
              width: '100%',
              chartArea: {
                left: '25',
                right: '25',
              },
              focusTarget: 'category',
              dataOpacity: 0.6,
              pointSize: 14,
              vAxis: {
                gridlines: {
                  color: '#454545',
                },
                baselineColor: '#454545',
                textStyle: {
                  color: '#fff',
                },
              },
              hAxis: {
                textStyle: {
                  color: '#fff',
                },
              },
              backgroundColor: {
                fillOpacity: GOOGLE_CHART_BG_OPACITY,
              },
              tooltip: {
                textStyle: {
                  fontSize: 13,
                },
              },
              legend: {
                textStyle: {
                  color: '#fff',
                },
              },
            },
          },
        })

        const getPieChart = (dimensions: string, container: string, title: string) => {
          return new gapi.analytics.googleCharts.DataChart({
            query: {
              dimensions,
              metrics: 'ga:sessions',
              'start-date': date,
              'end-date': date,
              'max-results': 15,
              sort: '-ga:sessions',
            },
            chart: {
              container,
              type: 'PIE',
              options: {
                title,
                width: '100%',
                pieHole: 0.5,
                colors: GOOGLE_CHART_COLORS,
                chartArea: {
                  left: '25',
                },
                annotations: {
                  stem: {
                    color: 'transparent',
                    length: 120,
                  },
                  textStyle: {
                    color: '#9E9E9E',
                    fontSize: 18,
                  },
                },
                backgroundColor: {
                  fillOpacity: GOOGLE_CHART_BG_OPACITY,
                },
                titleTextStyle: {
                  color: '#fff',
                },
                pieSliceBorderColor: 'transparent',
                pieSliceTextStyle: {
                  color: '#fff',
                },
                tooltip: {
                  showColorCode: true,
                  textStyle: {
                    fontSize: 12,
                  },
                },
                legend: {
                  textStyle: {
                    color: '#fff',
                  },
                },
              },
            },
          })
        }

        const countryChart = getPieChart('ga:country', GOOGLE_CHART_ID_MAP.COUNTRY, '国家地区')
        const cityChart = getPieChart('ga:city', GOOGLE_CHART_ID_MAP.CITY, '城市')
        const browserChart = getPieChart('ga:browser', GOOGLE_CHART_ID_MAP.BROWSER, '浏览器')
        const osChart = getPieChart('ga:operatingSystem', GOOGLE_CHART_ID_MAP.OS, '操作系统')

        const renderAllCharts = (query: any) => {
          timeline.set({ query }).execute()
          countryChart.set({ query }).execute()
          cityChart.set({ query }).execute()
          browserChart.set({ query }).execute()
          osChart.set({ query }).execute()
        }

        viewSelector.on('change', (ids: any) => renderAllCharts({ ids }))

        resolve(renderAllCharts)
      })
    })
  }

  onMounted(async () => {
    loading.start()
    if (!(window as any).gapi) {
      loadScript()
    }

    try {
      const accessToken = await getGAToken()
      const rerenderChart = await initAnalytics(accessToken, stringChartDate.value)
      rerenderAnalytics.value = rerenderChart
    } finally {
      loading.stop()
    }
  })

  return (
    <Card
      bordered={false}
      className={styles.gaCard}
      title={
        <div className={styles.toolbar}>
          <Button
            type="primary"
            className={styles.toggler}
            disabled={loading.state.value}
            onClick={handleToggleShow}
          >
            <Icon.StockOutlined />
          </Button>
          <div
            id={GOOGLE_CHART_VIEW_SELECTOR_ID}
            className={classnames(
              styles.selector,
              isShowSelectView.value ? styles.show : styles.hide
            )}
          ></div>
        </div>
      }
      extra={
        <Space>
          <DatePicker
            disabled={loading.state.value}
            disabledDate={(date) => date.isAfter(moment())}
            value={chartDate.value}
            onChange={(date) => {
              chartDate.value = date
              rerenderAnalytics.value?.({
                'start-date': stringChartDate.value,
                'end-date': stringChartDate.value,
              })
            }}
          />
          <Button.Group>
            <Button
              href="https://developers.google.com/analytics/devguides/reporting/embed/v1/"
              target="_blank"
              rel="noreferrer"
            >
              Doc
            </Button>
            <Button
              href="https://developers.google.com/analytics/devguides/reporting/embed/v1/core-methods-reference/"
              target="_blank"
              rel="noreferrer"
            >
              API
            </Button>
            <Button
              href="https://ga-dev-tools.appspot.com/embed-api/"
              target="_blank"
              rel="noreferrer"
            >
              Example
            </Button>
          </Button.Group>
        </Space>
      }
    >
      <Spin spinning={loading.state.value}>
        <div className={styles.pieCharts}>
          <div
            id={GOOGLE_CHART_ID_MAP.COUNTRY}
            className={classnames(styles.chart, styles.country)}
          />
          <div id={GOOGLE_CHART_ID_MAP.CITY} className={classnames(styles.chart, styles.city)} />
          <div
            id={GOOGLE_CHART_ID_MAP.BROWSER}
            className={classnames(styles.chart, styles.browser)}
          />
          <div id={GOOGLE_CHART_ID_MAP.OS} className={classnames(styles.chart, styles.os)} />
        </div>
        <Divider />
        <div id={GOOGLE_CHART_TIMELINE_ID} className={styles.timeline}></div>
      </Spin>
    </Card>
  )
}
