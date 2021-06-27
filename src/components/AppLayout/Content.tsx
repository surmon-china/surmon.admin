import React from 'react';
import { matchPath } from 'react-router';
import { useLocation } from 'react-router-dom';
import { Breadcrumb, BackTop, Typography } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';

import { scrollTo } from '@/services/scroller';
import { routeMap } from '@/route';

import styles from './style.module.less';

export const AppContent: React.FC = (props) => {
  const location = useLocation();
  const [, ...paths] = location.pathname.split('/');
  const currentRoute = Array.from(routeMap.values()).find((route) =>
    matchPath(location.pathname, {
      path: route.path,
      exact: true,
    })
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Typography.Title className={styles.title} level={4}>
          <span className={styles.icon}>{currentRoute?.icon}</span>
          {currentRoute?.name}
        </Typography.Title>
        <Breadcrumb className={styles.breadcrumb}>
          {paths.map((path) => (
            <Breadcrumb.Item key={path}>{path}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
      <div className={styles.pageContent}>{props?.children}</div>
      <BackTop
        className={styles.backTop}
        onClick={() => {
          scrollTo(document.body);
        }}
      >
        <div className={styles.tigger}>
          <CaretUpOutlined />
        </div>
      </BackTop>
    </div>
  );
};
