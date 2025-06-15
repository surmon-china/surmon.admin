import React from 'react'
import { Tooltip, Spin } from 'antd'
import * as Icons from '@ant-design/icons'
import { StaticFileObject } from '@/apis/static'
import { StaticListDataItem, isFolder, isImageTypeKey, getFileIcon } from './helper'

import styles from './style.module.less'

export interface GridListProps {
  loading: boolean
  data: StaticListDataItem[]
  onClickFolder(prefix: string): void
  onClickFile(fileObject: StaticFileObject): void
}

export const GridList: React.FC<GridListProps> = (props) => {
  const handleClick = (item: StaticListDataItem) => {
    isFolder(item) ? props.onClickFolder(item.prefix) : props.onClickFile(item)
  }

  const renderHandlerIcon = (item: StaticListDataItem) => {
    if (isFolder(item)) {
      return <Icons.FolderOutlined />
    } else if (isImageTypeKey(item.key)) {
      return <img loading="lazy" className={styles.image} src={item.url} />
    } else {
      return getFileIcon(item.key)
    }
  }

  return (
    <Spin spinning={props.loading}>
      <ul className={styles.fileGridList}>
        {props.data.map((item, index) => (
          <Tooltip
            key={index}
            placement="topLeft"
            destroyOnHidden={true}
            mouseEnterDelay={0.01}
            mouseLeaveDelay={0.01}
            title={isFolder(item) ? item.prefix : item.key}
          >
            <li className={styles.listItem} onClick={() => handleClick(item)}>
              <div className={styles.handler}>{renderHandlerIcon(item)}</div>
              <p className={styles.name}>{isFolder(item) ? item.prefix : item.key}</p>
            </li>
          </Tooltip>
        ))}
      </ul>
    </Spin>
  )
}
