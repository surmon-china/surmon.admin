import React from 'react'
import { Tag, Table, Button, Popover, Space } from 'antd'
import * as Icon from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { IPLocation } from '@/components/common/IPLocation'
import { Pagination } from '@/constants/request'
import { COMMENT_GUESTBOOK_POST_ID } from '@/constants/comment'
import {
  Vote,
  VoteType,
  getVoteTypeById,
  getVoteTargetText,
  getVoteAuthorTypeText,
} from '@/constants/vote'
import { parseBrowser, parseOS, parseDevice } from '@/transforms/ua'
import { stringToYMD } from '@/transforms/date'

export interface VoteListTableProps {
  loading: boolean
  data: Array<Vote>
  pagination: Pagination
  selectedIds: Array<string>
  onTargetID(id: number): any
  onSelecte(ids: Array<any>): any
  onPagination(page: number, pageSize?: number): any
}
export const VoteListTable: React.FC<VoteListTableProps> = (props) => {
  return (
    <Table<Vote>
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
          title: '目标',
          dataIndex: 'target_type',
          render: (_, vote) => (
            <Button type="link" onClick={() => props.onTargetID(vote.target_id)}>
              {getVoteTargetText(vote.target_type)} #
              {vote.target_id === COMMENT_GUESTBOOK_POST_ID ? 'Guestbook' : vote.target_id}
            </Button>
          ),
        },
        {
          title: '态度',
          dataIndex: 'vote_type',
          render: (_, vote) => (
            <Tag
              icon={getVoteTypeById(vote.vote_type).icon}
              color={vote.vote_type === VoteType.Upvote ? 'green' : 'red'}
            >
              <strong>{getVoteTypeById(vote.vote_type).name}</strong>
            </Tag>
          ),
        },
        {
          title: '用户',
          dataIndex: 'author_type',
          render: (_, vote) => (
            <Space direction="vertical">
              <UniversalText
                prefix={<Icon.MehOutlined />}
                text={getVoteAuthorTypeText(vote.author_type)}
              />
              <Popover
                title="用户数据"
                placement="right"
                content={<pre>{JSON.stringify(vote.author, null, 2)}</pre>}
              >
                <span>
                  <UniversalText
                    prefix={<Icon.UserOutlined />}
                    text={vote.author?.name}
                    placeholder="未知用户"
                  />
                </span>
              </Popover>
            </Space>
          ),
        },
        {
          title: 'IP 位置',
          dataIndex: 'ip',
          render(_, vote) {
            return (
              <Space direction="vertical">
                <UniversalText
                  prefix={<Icon.GlobalOutlined />}
                  text={vote.ip}
                  copyable={true}
                  placeholder="未知 IP"
                />
                <Space size="small">
                  <Icon.EnvironmentOutlined />
                  <IPLocation data={vote.ip_location} />
                </Space>
              </Space>
            )
          },
        },
        {
          title: '软件终端',
          dataIndex: 'user_agent',
          render(_, vote) {
            return (
              <Space direction="vertical">
                <UniversalText
                  prefix={<Icon.CompassOutlined />}
                  text={parseBrowser(vote.user_agent!)}
                  placeholder="未知浏览器"
                />
                <Space size="small">
                  <UniversalText
                    prefix={<Icon.DesktopOutlined />}
                    text={parseOS(vote.user_agent!)}
                    placeholder="未知系统"
                  />
                </Space>
              </Space>
            )
          },
        },
        {
          title: '硬件时间',
          dataIndex: 'create_at',
          render(_, vote) {
            return (
              <Space direction="vertical">
                <Space size="small">
                  <UniversalText
                    prefix={<Icon.LaptopOutlined />}
                    text={parseDevice(vote.user_agent!)}
                    placeholder="未知设备"
                  />
                </Space>
                <UniversalText
                  prefix={<Icon.ClockCircleOutlined />}
                  text={stringToYMD(vote.create_at!)}
                />
              </Space>
            )
          },
        },
      ]}
    />
  )
}
