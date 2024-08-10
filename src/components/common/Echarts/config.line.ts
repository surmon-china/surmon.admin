import type { ChartOptions } from '.'

export interface ChartOptionsConfig {
  categoryData: string[]
  linesData: Array<{
    data: number[]
    name?: string
    color?: string
    zIndex?: number
  }>

  xLabelFormatter?(value: string, index: number): string
  tooltipLabelFormatter?(params: any): string
}

export const getLineChartConfig = (config: ChartOptionsConfig): ChartOptions => ({
  grid: {
    show: true,
    top: '4',
    left: '0',
    right: '0',
    bottom: '0',
    borderWidth: 0,
    containLabel: true
  },
  series: config.linesData.map((item) => ({
    type: 'line',
    z: item.zIndex,
    name: item.name,
    data: item.data,
    itemStyle: {
      color: item.color
    }
  })),
  xAxis: [
    {
      type: 'category',
      data: config.categoryData,
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
        formatter: config.xLabelFormatter,
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
        fontFamily: 'inherit',
        color: 'var(--app-color-text-secondary)',
        formatter(value) {
          return value ? String(value) : ''
        }
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
      label: {
        formatter: config.tooltipLabelFormatter
      }
    }
  }
})
