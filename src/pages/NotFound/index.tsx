/**
 * @file App 404 page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Result, Button } from 'antd'

import styles from './style.module.less'

export const NotFoundPage: React.FC = () => (
  <div className={styles.notFound}>
    <Result
      status="warning"
      title="404 NOT FOUND"
      extra={
        <Link to="/">
          <Button type="link">Go Home</Button>
        </Link>
      }
    />
  </div>
)
