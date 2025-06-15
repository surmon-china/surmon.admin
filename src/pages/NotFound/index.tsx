/**
 * @file 404 page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Link } from 'react-router'
import { Flex, Result, Button } from 'antd'
import { Trans } from '@/i18n'

import styles from './style.module.less'

export const NotFoundPage: React.FC = () => (
  <Flex justify="center" align="center" className={styles.notFoundPage}>
    <Result
      status="warning"
      title="404 NOT FOUND"
      extra={
        <Link to="/">
          <Button type="link">
            <Trans i18nKey="page.404.link" />
          </Button>
        </Link>
      }
    />
  </Flex>
)
