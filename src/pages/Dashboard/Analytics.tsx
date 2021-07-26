import React from 'react';
import { Card, Divider, Button, Spin, Result } from 'antd';
import { StockOutlined, MehOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { useRef, onMounted } from 'veact';

import { APP_COLOR_PRIMARY } from '@/config';
import { getGAToken } from '@/store/system';
import { useLoading } from '@/services/loading';
import storage from '@/services/storage';
import styles from './style.module.less';

// @ts-ignore
import { loadScript } from './analytics-loader.js';

const GOOGLE_CHART_VIEW_SELECTOR_ID = 'view-selector';
const GOOGLE_CHART_TIMELINE_ID = 'timeline';
const GOOGLE_CHART_ID_MAP = {
  COUNTRY: 'country',
  CITY: 'city',
  BROWSER: 'browser',
  OS: 'os',
};

const GOOGLE_CHART_BG_OPACITY = 0.05;
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
];

export const Analytics: React.FC = () => {
  const isDisabled = useRef(Boolean(storage.get('DISABLED_GA')));
  const isShowSelectView = useRef(false);
  const loading = useLoading();

  const handleToggleShow = () => {
    isShowSelectView.value = !isShowSelectView.value;
  };

  const instanceGA = async (access_token: string): Promise<void> => {
    const gapi = (window as any).gapi;
    gapi.analytics.ready(() => {
      // 服务端授权立即生效，无需事件处理
      gapi.analytics.auth.authorize({
        serverAuth: { access_token },
      });

      const viewSelector = new gapi.analytics.ViewSelector({
        container: GOOGLE_CHART_VIEW_SELECTOR_ID,
      });
      viewSelector.execute();

      const timeline = new gapi.analytics.googleCharts.DataChart({
        reportType: 'ga',
        query: {
          dimensions: 'ga:hour',
          metrics: 'ga:sessions',
          'start-date': 'today',
          'end-date': 'today',
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
      });

      const getPieChart = (dimensions: string, container: string, title: string) =>
        new gapi.analytics.googleCharts.DataChart({
          query: {
            dimensions,
            metrics: 'ga:sessions',
            'start-date': 'today',
            'end-date': 'today',
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
        });

      const countryChart = getPieChart(
        'ga:country',
        GOOGLE_CHART_ID_MAP.COUNTRY,
        '国家地区'
      );
      const cityChart = getPieChart('ga:city', GOOGLE_CHART_ID_MAP.CITY, '城市');
      const browserChart = getPieChart(
        'ga:browser',
        GOOGLE_CHART_ID_MAP.BROWSER,
        '浏览器'
      );
      const osChart = getPieChart(
        'ga:operatingSystem',
        GOOGLE_CHART_ID_MAP.OS,
        '操作系统'
      );

      viewSelector.on('change', (ids: any) => {
        const newIds = {
          query: { ids },
        };
        timeline.set(newIds).execute();
        countryChart.set(newIds).execute();
        cityChart.set(newIds).execute();
        browserChart.set(newIds).execute();
        osChart.set(newIds).execute();
      });
    });
  };

  const initGAClient = async () => {
    loading.start();
    if (!(window as any).gapi) {
      loadScript();
    }
    getGAToken()
      .then(instanceGA)
      .finally(() => {
        loading.stop();
      });
  };

  const handleEnable = () => {
    isDisabled.value = false;
    initGAClient();
  };

  onMounted(() => {
    // 由于阿里云无法访问到 googleapis 服务，所以生产环境不可用，为了使其可退化，用 localStorage 存一个特殊字段来判断吧
    if (!isDisabled.value) {
      initGAClient();
    }
  });

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
            <StockOutlined />
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
      }
    >
      {isDisabled.value ? (
        <Result
          title="GA DISABLED"
          icon={<MehOutlined />}
          extra={<Button onClick={handleEnable}>ENABLE</Button>}
        />
      ) : (
        <Spin spinning={loading.state.value}>
          <div className={styles.pieCharts}>
            <div
              id={GOOGLE_CHART_ID_MAP.COUNTRY}
              className={classnames(styles.chart, styles.country)}
            />
            <div
              id={GOOGLE_CHART_ID_MAP.CITY}
              className={classnames(styles.chart, styles.city)}
            />
            <div
              id={GOOGLE_CHART_ID_MAP.BROWSER}
              className={classnames(styles.chart, styles.browser)}
            />
            <div
              id={GOOGLE_CHART_ID_MAP.OS}
              className={classnames(styles.chart, styles.os)}
            />
          </div>
          <Divider />
          <div id={GOOGLE_CHART_TIMELINE_ID} className={styles.timeline}></div>
        </Spin>
      )}
    </Card>
  );
};
