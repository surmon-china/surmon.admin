import { googleAnalyticsBatchRunReports } from '@/apis/google-analytics'

export interface ReportRowItem {
  dimensionValues: Array<{ value: string }>
  metricValues: Array<{ value: string }>
}

export const getRunReportRequestByDimensions = (options: {
  /**
   * @example ['pagePath']
   * @example ['country', 'city']
   * @see {@link https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions `Dimensions` Document}
   */
  dimensions: string[]
  /**
   * @example ['activeUsers']
   * @example ['activeUsers', 'screenPageViews']
   * @see {@link https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics `Metrics` Document}
   */
  metrics: string[]
  /**
   * @example 'today'
   * @example 'yesterday'
   * @example '7daysAgo' (NdaysAgo)
   * @example '2024-08-08' (YYYY-MM-DD)
   * @see {@link https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/AccessDateRange `AccessDateRange` Document}
   */
  startDate: string
  /**
   * @example 'today'
   * @example 'yesterday'
   * @example '7daysAgo'
   * @example '2024-08-08'
   * @see {@link https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/AccessDateRange `AccessDateRange` Document}
   */
  endDate: string
  /**
   * @example [{ dimension: { dimensionName: 'date', orderType: 'ALPHANUMERIC' } }]
   * @example [{ metric: { metricName: 'date' }, desc: true }]
   * @see {@link https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/OrderBy `OrderBy` Document}
   */
  orderBys?: any
  /**
   * @see {@link https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunReports `keepEmptyRows` Document}
   */
  keepEmptyRows?: boolean
}) => ({
  dateRanges: [{ startDate: options.startDate, endDate: options.endDate }],
  dimensions: options.dimensions.map((name) => ({ name })),
  metrics: options.metrics.map((name) => ({ name })),
  // https://github.com/google/site-kit-wp/issues/6623
  keepEmptyRows: options.keepEmptyRows,
  orderBys: options.orderBys
})

export const getUvPvRowsFromReports = (reports: any[]): ReportRowItem[] => {
  return reports[0]?.rows || []
}

export const getRegionRowsFromReports = (reports: any[]): ReportRowItem[] => {
  return reports[1]?.rows || []
}

export const getDeviceRowsFromReports = (reports: any[]): ReportRowItem[] => {
  return reports[2]?.rows || []
}

export const getPageRowsFromReports = (reports: any[]): ReportRowItem[] => {
  return reports[3]?.rows || []
}

export const getTitleRowsFromReports = (reports: any[]): ReportRowItem[] => {
  return reports[4]?.rows || []
}

export const fetchAnalyticsReports = async (
  startDate: string,
  endDate: string,
  chartDimension: string
) => {
  return googleAnalyticsBatchRunReports({
    requests: [
      // UV + PV: year | month | yearMonth | day | hour | minute | date | dateHour | dateHourMinute | dayOfWeek | dayOfWeekName
      getRunReportRequestByDimensions({
        startDate,
        endDate,
        dimensions: [chartDimension],
        metrics: ['activeUsers', 'screenPageViews', 'eventCount'],
        orderBys: [{ dimension: { dimensionName: chartDimension } }],
        keepEmptyRows: true
      }),
      // UV: countries + cities
      getRunReportRequestByDimensions({
        dimensions: ['countryId', 'city'],
        metrics: ['activeUsers'],
        startDate,
        endDate
      }),
      // UV: os + device model
      getRunReportRequestByDimensions({
        dimensions: ['operatingSystem', 'mobileDeviceModel'],
        metrics: ['activeUsers'],
        startDate,
        endDate
      }),
      // PV: page paths
      getRunReportRequestByDimensions({
        dimensions: ['pagePath'],
        metrics: ['screenPageViews'],
        startDate,
        endDate
      }),
      // PV: page titles
      getRunReportRequestByDimensions({
        dimensions: ['pageTitle'],
        metrics: ['screenPageViews'],
        startDate,
        endDate
      })
    ]
  })
}
