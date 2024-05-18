import { APP_PRIMARY_COLOR } from '@/config'
import { ChartOptions } from './Chart'

export interface ChartOptionsConfig {
  countList: number[]
  dateList: string[]
  startValue: string
  endValue: string
}

export const getChartConfig = (config: ChartOptionsConfig): ChartOptions => ({
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
      data: config.countList,
      itemStyle: {
        color: APP_PRIMARY_COLOR
      }
    }
  ],
  xAxis: [
    {
      type: 'category',
      data: config.dateList,
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
    // @ts-ignore
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
      startValue: config.startValue,
      endValue: config.endValue
    },
    {
      show: true,
      brushSelect: false,
      startValue: config.startValue,
      endValue: config.endValue,
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
})
