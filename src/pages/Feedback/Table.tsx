import React from 'react'
import { Table, Button, Typography, Popover, Space, Statistic } from 'antd'
import * as Icon from '@ant-design/icons'
import { Placeholder } from '@/components/common/Placeholder'
import { UniversalText } from '@/components/common/UniversalText'
import { IPLocation } from '@/components/common/IPLocation'
import { Pagination } from '@/constants/request'
import { Feedback, getMarkedByBoolean } from '@/constants/feedback'
import { parseBrowser, parseOS, parseDevice } from '@/transforms/ua'
import { stringToYMD } from '@/transforms/date'

import styles from './style.module.less'

export interface FeedbackListTableProps {
  loading: boolean
  data: Array<Feedback>
  pagination: Pagination
  selectedIds: Array<string>
  onTargetID(id: number): any
  onSelecte(ids: Array<any>): any
  onPagination(page: number, pageSize?: number): any
  onDetail(feedback: Feedback, index: number): any
  onDelete(feedback: Feedback, index: number): any
}
export const FeedbackListTable: React.FC<FeedbackListTableProps> = (props) => {
  return (
    <Table<Feedback>
      rowKey="_id"
      loading={props.loading}
      dataSource={props.data}
      rowSelection={{
        selectedRowKeys: props.selectedIds,
        onChange: props.onSelecte,
      }}
      pagination={{
        pageSizeOptions: ['10', '20', '50'],
        current: props.pagination?.current_page,
        pageSize: props.pagination?.per_page,
        total: props.pagination?.total,
        showSizeChanger: true,
        onChange: props.onPagination,
      }}
      columns={[
        {
          title: 'ID',
          width: 40,
          dataIndex: 'id',
        },
        {
          title: 'TID',
          width: 40,
          dataIndex: 'tid',
        },
        {
          title: '标记',
          width: 60,
          align: 'center',
          dataIndex: 'marked',
          render: (_, feedback) => getMarkedByBoolean(feedback.marked).icon,
        },
        {
          title: '评分',
          width: 80,
          align: 'center',
          dataIndex: 'emotion',
          render: (_, feedback) => (
            <Statistic prefix={feedback.emotion_emoji} value={feedback.emotion} />
          ),
        },
        {
          title: '反馈内容',
          dataIndex: 'content',
          render: (_, feedback) => (
            <Typography.Paragraph
              className={styles.content}
              ellipsis={{ rows: 3, expandable: true }}
            >
              {feedback.content}
            </Typography.Paragraph>
          ),
        },
        {
          title: '备注',
          width: 180,
          dataIndex: 'remark',
          render: (_, feedback) => (
            <Placeholder data={feedback.remark || null}>
              {(remark) => (
                <Typography.Paragraph
                  className={styles.content}
                  ellipsis={{ rows: 3, expandable: true }}
                >
                  {remark}
                </Typography.Paragraph>
              )}
            </Placeholder>
          ),
        },
        {
          title: '发布于',
          width: 200,
          dataIndex: 'agent',
          render(_, feedback) {
            return (
              <Space direction="vertical">
                <Popover
                  title="终端信息"
                  placement="left"
                  style={{ width: 300 }}
                  content={
                    <div>
                      <Typography.Paragraph>
                        <UniversalText prefix="用户：" text={feedback.user_name} />
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <UniversalText
                          prefix="邮箱："
                          text={feedback.user_email}
                          copyable={true}
                        />
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <UniversalText prefix="来源：" text={feedback.origin} copyable={true} />
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <UniversalText
                          prefix="IP："
                          text={feedback.ip || void 0}
                          copyable={true}
                        />
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        位置： <IPLocation data={feedback.ip_location} />
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <UniversalText
                          prefix="浏览器："
                          text={parseBrowser(feedback.user_agent)}
                        />
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <UniversalText prefix="系统：" text={parseOS(feedback.user_agent)} />
                      </Typography.Paragraph>
                      <div>
                        <UniversalText prefix="设备：" text={parseDevice(feedback.user_agent)} />
                      </div>
                    </div>
                  }
                >
                  <span>
                    <UniversalText
                      prefix={<Icon.UserOutlined />}
                      text={feedback.user_name}
                      placeholder="Anonymous"
                    />
                  </span>
                </Popover>

                <UniversalText
                  prefix={<Icon.ClockCircleOutlined />}
                  text={stringToYMD(feedback.create_at!)}
                />
              </Space>
            )
          },
        },
        {
          title: '操作',
          width: 120,
          dataIndex: 'actions',
          render: (_, feedback, index) => (
            <Space direction="vertical">
              <Button
                size="small"
                type="text"
                block={true}
                icon={<Icon.EditOutlined />}
                onClick={() => props.onDetail(feedback, index)}
              >
                反馈详情
              </Button>
              <Button
                size="small"
                type="text"
                danger={true}
                block={true}
                icon={<Icon.DeleteOutlined />}
                onClick={() => props.onDelete(feedback, index)}
              >
                彻底删除
              </Button>
            </Space>
          ),
        },
      ]}
    />
  )
}
