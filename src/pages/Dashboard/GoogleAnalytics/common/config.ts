import dayjs from 'dayjs'
import type { ChartOptionsConfig } from '@/components/common/Echarts/config.line'

export interface GaDateRangeOption {
  label: string
  value: string
  gaQueryParams: {
    getStartDate(): string
    getEndDate(): string
    dimension: string
  }
  chartConfig: {
    xAxisList(): string[]
    xLabelFormatter?: ChartOptionsConfig['xLabelFormatter']
    tooltipLabelFormatter?: ChartOptionsConfig['tooltipLabelFormatter']
  }
}

export const GA_DATE_RANGE_OPTIONS: GaDateRangeOption[] = [
  {
    label: '今天',
    value: 'today',
    gaQueryParams: {
      getStartDate: () => 'today',
      getEndDate: () => 'today',
      dimension: 'hour'
    },
    chartConfig: {
      xAxisList: () => Array.from({ length: 24 }, (_, i) => `${i}`),
      xLabelFormatter: (value: string) => value.padStart(2, '0'),
      tooltipLabelFormatter: (params) => {
        const hour = params.value.padStart(2, '0')
        return `${hour}:00 ~`
      }
    }
  },
  {
    label: '昨天',
    value: 'yesterday',
    gaQueryParams: {
      getStartDate: () => 'yesterday',
      getEndDate: () => 'yesterday',
      dimension: 'hour'
    },
    chartConfig: {
      xAxisList: () => Array.from({ length: 24 }, (_, i) => `${i}`),
      xLabelFormatter: (value: string) => value.padStart(2, '0'),
      tooltipLabelFormatter: (params) => {
        const hour = params.value.padStart(2, '0')
        return `${hour}:00 ~`
      }
    }
  },
  {
    label: '过去 7 天',
    value: '7days',
    gaQueryParams: {
      getStartDate: () => '7daysAgo',
      getEndDate: () => 'yesterday',
      dimension: 'date'
    },
    chartConfig: {
      xAxisList: () => {
        return Array.from({ length: 7 }, (_, i) => {
          return dayjs()
            .subtract(7 - i, 'day')
            .format('YYYYMMDD')
        })
      },
      xLabelFormatter: (value: string) => {
        const month = value.slice(4, 6)
        const day = value.slice(6, 8)
        return `${month}/${day}`
      },
      tooltipLabelFormatter: ({ value }) => {
        const year = value.slice(0, 4)
        const month = value.slice(4, 6)
        const day = value.slice(6, 8)
        return `${year}-${month}-${day}`
      }
    }
  },
  {
    label: '过去 30 天',
    value: '30days',
    gaQueryParams: {
      getStartDate: () => '30daysAgo',
      getEndDate: () => 'yesterday',
      dimension: 'date'
    },
    chartConfig: {
      xAxisList: () => {
        return Array.from({ length: 30 }, (_, i) => {
          return dayjs()
            .subtract(30 - i, 'day')
            .format('YYYYMMDD')
        })
      },
      xLabelFormatter: (value: string) => {
        const month = value.slice(4, 6)
        const day = value.slice(6, 8)
        return `${month}/${day}`
      },
      tooltipLabelFormatter: ({ value }) => {
        const year = value.slice(0, 4)
        const month = value.slice(4, 6)
        const day = value.slice(6, 8)
        return `${year}-${month}-${day}`
      }
    }
  },
  {
    label: '过去 12 个月',
    value: '12months',
    gaQueryParams: {
      getStartDate: () => dayjs().subtract(12, 'month').format('YYYY-MM-DD'),
      getEndDate: () => 'yesterday',
      dimension: 'yearMonth'
    },
    chartConfig: {
      xAxisList: () => {
        return Array.from({ length: 13 }, (_, i) => {
          return dayjs()
            .subtract(12 - i, 'month')
            .format('YYYYMM')
        })
      },
      xLabelFormatter: (value: string) => {
        const year = value.slice(0, 4)
        const month = value.slice(4, 6)
        return `${year}/${month}`
      },
      tooltipLabelFormatter: ({ value }) => {
        const year = value.slice(0, 4)
        const month = value.slice(4, 6)
        return `${year}-${month}`
      }
    }
  }
]
