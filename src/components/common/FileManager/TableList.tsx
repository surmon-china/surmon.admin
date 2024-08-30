import React from 'react'
import { Typography, Table, Tooltip, Space } from 'antd'
import type { TableProps } from 'antd'
import * as Icons from '@ant-design/icons'
import { timestampToYMD } from '@/transforms/date'
import { StaticFileObject } from '@/apis/static'
import { StaticListDataItem, isFolder, getFileIcon, transformSizeToKb } from './helper'

export interface TableListProps {
  size?: TableProps['size']
  loading: boolean
  data: StaticListDataItem[]
  onClickFolder(prefix: string): void
  onClickFile(fileObject: StaticFileObject): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  const columns: TableProps<StaticListDataItem>['columns'] = [
    {
      title: 'Key',
      dataIndex: 'key',
      sorter: (a, b) => {
        const aTarget = isFolder(a) ? a.prefix : a.key
        const bTarget = isFolder(b) ? b.prefix : b.key
        return aTarget.localeCompare(bTarget)
      },
      render: (_, item) => (
        <Space size="small">
          {isFolder(item) ? <Icons.FolderOutlined /> : getFileIcon(item.key)}
          {isFolder(item) ? (
            <Typography.Link onClick={() => props.onClickFolder(item.prefix)}>
              {item.prefix}
            </Typography.Link>
          ) : (
            <Tooltip title={item.url} placement="topLeft">
              <Typography.Link
                copyable={{ text: item.url }}
                onClick={() => props.onClickFile(item)}
              >
                {item.key}
              </Typography.Link>
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      width: 96,
      title: 'Size',
      dataIndex: 'size',
      sorter: (a, b) => {
        const aTarget = isFolder(a) ? 0 : a.size
        const bTarget = isFolder(b) ? 0 : b.size
        return aTarget - bTarget
      },
      render: (_, item) => (isFolder(item) ? '-' : transformSizeToKb(item.size))
    },
    {
      width: 160,
      title: 'LastModified',
      dataIndex: 'lastModified',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        const aTarget = isFolder(a) ? 0 : (a.lastModified ?? 0)
        const bTarget = isFolder(b) ? 0 : (b.lastModified ?? 0)
        return aTarget - bTarget
      },
      render: (_, item) => (isFolder(item) ? '-' : timestampToYMD(item.lastModified!))
    },

    {
      width: 120,
      title: 'StorageClass',
      dataIndex: 'storageClass',
      render: (_, item) => (isFolder(item) ? '-' : item.storageClass)
    }
  ]

  return (
    <Table
      size={props.size}
      pagination={false}
      columns={columns}
      loading={props.loading}
      dataSource={props.data}
    />
  )
}
