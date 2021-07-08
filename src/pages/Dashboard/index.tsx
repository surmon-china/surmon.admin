/**
 * @file Dashboard page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react';
import { useRef, onMounted } from '@/veact';
import { Row, Col, Card, Statistic, Space } from 'antd';
import {
  EyeOutlined,
  TagOutlined,
  CommentOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';

import { APP_LAYOUT_SPACE_SIZE } from '@/config';
import { useLoading } from '@/services/loading';
import { Statistics, getStatistics } from '@/store/system';
import { Analytics } from './Analytics';

import styles from './style.module.less';

export const DashboardPage: React.FC = () => {
  const statistics = useRef<Statistics>({});
  const loading = useLoading();

  const fetchStatistics = () => {
    loading.promise(getStatistics()).then((result) => {
      statistics.value = result;
    });
  };

  onMounted(() => {
    fetchStatistics();
  });

  return (
    <Space
      direction="vertical"
      size={APP_LAYOUT_SPACE_SIZE}
      className={styles.dashboard}
    >
      <Space size={APP_LAYOUT_SPACE_SIZE} className={styles.statistic}>
        <Card bordered={false} className={styles.statisticCard}>
          <Row>
            <Col span={14}>
              <Statistic
                loading={loading.state.value}
                title="今日文章阅读"
                value={statistics.value.views}
              />
            </Col>
            <Col span={10} className={styles.icon}>
              <EyeOutlined />
            </Col>
          </Row>
        </Card>
        <Card bordered={false} className={styles.statisticCard}>
          <Row>
            <Col span={14}>
              <Statistic
                loading={loading.state.value}
                title="全站文章"
                value={statistics.value.articles}
              />
            </Col>
            <Col span={10} className={styles.icon}>
              <CoffeeOutlined />
            </Col>
          </Row>
        </Card>
        <Card bordered={false} className={styles.statisticCard}>
          <Row>
            <Col span={14}>
              <Statistic
                loading={loading.state.value}
                title="全站标签"
                value={statistics.value.tags}
              />
            </Col>
            <Col span={10} className={styles.icon}>
              <TagOutlined />
            </Col>
          </Row>
        </Card>
        <Card bordered={false} className={styles.statisticCard}>
          <Row>
            <Col span={14}>
              <Statistic
                loading={loading.state.value}
                title="全站评论"
                value={statistics.value.comments}
              />
            </Col>
            <Col span={10} className={styles.icon}>
              <CommentOutlined />
            </Col>
          </Row>
        </Card>
      </Space>
      <Row>
        <Col span={24}>
          <Analytics />
        </Col>
      </Row>
    </Space>
  );
};
