import React from 'react'
import { Table, Button } from 'antd'
import * as Icon from '@ant-design/icons'
import { Pagination } from '@/constants/nodepress'
import { Tag } from '@/constants/tag'
import { getBlogTagUrl } from '@/transforms/url'

export interface TableListProps {
  loading: boolean
  data: Array<Tag>
  pagination?: Pagination
  selectedIds: Array<string>
  onSelect(ids: Array<any>): void
  onPagination(page: number, pageSize?: number): void
  onEdit(tag: Tag, index: number): void
  onDelete(tag: Tag, index: number): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<Tag>
      rowKey="_id"
      loading={props.loading}
      dataSource={props.data}
      rowSelection={{
        selectedRowKeys: props.selectedIds,
        onChange: props.onSelect
      }}
      pagination={{
        pageSizeOptions: ['10', '20', '50'],
        current: props.pagination?.current_page,
        pageSize: props.pagination?.per_page,
        total: props.pagination?.total,
        showSizeChanger: true,
        onChange: props.onPagination
      }}
      columns={[
        {
          title: 'ID',
          width: 60,
          dataIndex: 'id',
          responsive: ['md']
        },
        {
          title: '名称',
          dataIndex: 'name',
          width: 140
        },
        {
          title: '别名',
          dataIndex: 'slug',
          width: 160
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '文章',
          width: 80,
          align: 'right',
          dataIndex: 'article_count'
        },
        {
          title: '操作',
          width: 240,
          align: 'right',
          dataIndex: 'actions',
          render: (_, tag, index) => (
            <Button.Group size="small">
              <Button
                type="text"
                icon={<Icon.EditOutlined />}
                onClick={() => props.onEdit(tag, index)}
              >
                编辑
              </Button>
              <Button
                type="text"
                danger={true}
                icon={<Icon.DeleteOutlined />}
                onClick={() => props.onDelete(tag, index)}
              >
                删除
              </Button>
              <Button
                type="link"
                target="_blank"
                icon={<Icon.ExportOutlined />}
                href={getBlogTagUrl(tag.slug)}
              >
                查看
              </Button>
            </Button.Group>
          )
        }
      ]}
    />
  )
}
