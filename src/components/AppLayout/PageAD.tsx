import React from 'react'
import { onMounted, useRef } from 'veact'
import { Button } from 'antd'
import * as Icon from '@ant-design/icons'

import styles from './style.module.less'

export const PageHeaderAD: React.FC = () => {
  const isVisibleAD = useRef(true)
  const closeAD = () => {
    isVisibleAD.value = false
  }

  onMounted(() => {
    ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
  })

  if (isVisibleAD.value) {
    return (
      <div className={styles.appPageHeaderMammon}>
        <div className={styles.mammonBox}>
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: 728, height: 90 }}
            data-ad-client="ca-pub-4710915636313788"
            data-ad-slot="5883149084"
          ></ins>
          <Button className={styles.closeButton} size="middle" type="text" onClick={closeAD}>
            <Icon.CloseOutlined />
          </Button>
        </div>
      </div>
    )
  }

  return null
}
