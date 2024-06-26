import React from 'react'
import { Tag, Table, Button, Popover, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { IPLocation } from '@/components/common/IPLocation'
import { Pagination } from '@/constants/nodepress'
import { COMMENT_GUESTBOOK_POST_ID } from '@/constants/comment'
import { parseBrowser, parseOS, parseDevice } from '@/transforms/ua'
import { stringToYMD } from '@/transforms/date'
import {
  Vote,
  VoteType,
  getVoteType,
  getVoteTargetText,
  getVoteAuthorTypeText
} from '@/constants/vote'

export interface TableListProps {
  loading: boolean
  data: Vote[]
  pagination: Pagination
  selectedIds: string[]
  onSelecte(ids: any[]): void
  onPaginate(page: number, pageSize?: number): void
  onClickTarget(vote: Vote): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<Vote>
      rowKey="_id"
      loading={props.loading}
      dataSource={props.data}
      rowSelection={{
        selectedRowKeys: props.selectedIds,
        onChange: props.onSelecte
      }}
      pagination={{
        pageSizeOptions: ['10', '20', '50'],
        current: props.pagination?.current_page,
        pageSize: props.pagination?.per_page,
        total: props.pagination?.total,
        showSizeChanger: true,
        onChange: props.onPaginate
      }}
      columns={[
        {
          title: 'ID',
          width: 40,
          dataIndex: 'id'
        },
        {
          title: '目标',
          dataIndex: 'target_type',
          render: (_, vote) => (
            <Button type="link" onClick={() => props.onClickTarget(vote)}>
              {getVoteTargetText(vote.target_type)} #
              {vote.target_id === COMMENT_GUESTBOOK_POST_ID ? 'Guestbook' : vote.target_id}
            </Button>
          )
        },
        {
          title: '态度',
          dataIndex: 'vote_type',
          render: (_, vote) => (
            <Tag
              icon={getVoteType(vote.vote_type).icon}
              color={vote.vote_type === VoteType.Upvote ? 'green' : 'red'}
            >
              <strong>{getVoteType(vote.vote_type).name}</strong>
            </Tag>
          )
        },
        {
          title: '用户',
          dataIndex: 'author_type',
          render: (_, vote) => (
            <Space direction="vertical">
              <UniversalText
                prefix={<Icons.MehOutlined />}
                text={getVoteAuthorTypeText(vote.author_type)}
              />
              <Popover
                title="用户数据"
                placement="right"
                content={<pre>{JSON.stringify(vote.author, null, 2)}</pre>}
              >
                <span>
                  <UniversalText
                    prefix={<Icons.UserOutlined />}
                    text={vote.author?.name}
                    placeholder="未知用户"
                  />
                </span>
              </Popover>
            </Space>
          )
        },
        {
          title: 'IP / GEO',
          dataIndex: 'ip',
          render(_, vote) {
            return (
              <Space direction="vertical">
                <UniversalText
                  prefix={<Icons.GlobalOutlined />}
                  text={vote.ip}
                  copyable={true}
                  placeholder="未知 IP"
                />
                <Space size="small">
                  <Icons.EnvironmentOutlined />
                  <IPLocation data={vote.ip_location} />
                </Space>
              </Space>
            )
          }
        },
        {
          title: '软件 / 终端',
          dataIndex: 'user_agent',
          render(_, vote) {
            return (
              <Space direction="vertical">
                <UniversalText
                  prefix={<Icons.CompassOutlined />}
                  text={parseBrowser(vote.user_agent!)}
                  placeholder="未知浏览器"
                />
                <Space size="small">
                  <UniversalText
                    prefix={<Icons.DesktopOutlined />}
                    text={parseOS(vote.user_agent!)}
                    placeholder="未知系统"
                  />
                </Space>
              </Space>
            )
          }
        },
        {
          title: '硬件 / 时间',
          dataIndex: 'created_at',
          render(_, vote) {
            return (
              <Space direction="vertical">
                <Space size="small">
                  <UniversalText
                    prefix={<Icons.LaptopOutlined />}
                    text={parseDevice(vote.user_agent!)}
                    placeholder="未知设备"
                  />
                </Space>
                <UniversalText
                  prefix={<Icons.ClockCircleOutlined />}
                  text={stringToYMD(vote.created_at!)}
                />
              </Space>
            )
          }
        }
      ]}
    />
  )
}
