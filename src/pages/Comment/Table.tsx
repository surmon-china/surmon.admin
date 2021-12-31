import React from 'react'
import { Table, Button, Typography, Popover, Avatar, Tag, Space } from 'antd'
import {
  DeleteOutlined,
  LinkOutlined,
  EditOutlined,
  LikeOutlined,
  DislikeOutlined,
  CheckOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { Pagination } from '@/constants/request'
import { Comment, CommentState, cs, COMMENT_GUESTBOOK_ID } from '@/constants/comment'
import { parseBrowser, parseOS } from '@/transforms/ua'
import { stringToYMD } from '@/transforms/date'
import { autoCommentAvatar } from '@/transforms/avatar'
import { getBlogURLByPostID } from '@/transforms/url'

import styles from './style.module.less'

export interface CommentListTableProps {
  loading: boolean
  data: Array<Comment>
  pagination: Pagination
  selectedIds: Array<string>
  onPostId(id: number): any
  onSelecte(ids: Array<any>): any
  onPagination(page: number, pageSize?: number): any
  onDetail(comment: Comment, index: number): any
  onDelete(comment: Comment, index: number): any
  onUpdateState(comment: Comment, state: CommentState): any
}
export const CommentListTable: React.FC<CommentListTableProps> = (props) => {
  return (
    <Table<Comment>
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
          title: 'PID',
          width: 40,
          dataIndex: 'pid',
          render(_, comment) {
            return comment.pid || '-'
          },
        },
        {
          title: 'POST_ID',
          width: 40,
          dataIndex: 'post_id',
          render(_, comment) {
            return (
              <Button
                size="small"
                type="ghost"
                onClick={() => props.onPostId(comment.post_id)}
              >
                {comment.post_id || '留言板'}
              </Button>
            )
          },
        },
        {
          title: '评论内容',
          width: 300,
          dataIndex: 'content',
          render: (_, comment) => (
            <Typography.Paragraph
              className={styles.content}
              ellipsis={{ rows: 6, expandable: true }}
            >
              {comment.content}
            </Typography.Paragraph>
          ),
        },
        {
          title: '个人信息',
          width: 240,
          dataIndex: 'author',
          render(_, comment) {
            return (
              <Space direction="vertical">
                <span>
                  头像：
                  <Avatar
                    shape="square"
                    size="default"
                    src={autoCommentAvatar(comment)}
                  />
                </span>
                <span>名字：{comment.author.name}</span>
                <span>
                  邮箱：
                  {!comment.author.email ? (
                    '-'
                  ) : (
                    <Typography.Text copyable={true}>
                      {comment.author.email}
                    </Typography.Text>
                  )}
                </span>
                <span>
                  网址：
                  {comment.author.site ? (
                    <Typography.Link
                      underline={true}
                      target="_blank"
                      rel="noreferrer"
                      href={comment.author.site}
                    >
                      点击打开
                    </Typography.Link>
                  ) : (
                    '-'
                  )}
                </span>
              </Space>
            )
          },
        },
        {
          title: '发布于',
          width: 230,
          dataIndex: 'agent',
          render(_, comment) {
            return (
              <Space direction="vertical">
                <span>
                  IP：
                  {!comment.ip ? (
                    '-'
                  ) : (
                    <Typography.Text copyable={true}>{comment.ip}</Typography.Text>
                  )}
                </span>
                <span>
                  位置：
                  {!comment.ip_location
                    ? '-'
                    : [
                        comment.ip_location.country,
                        comment.ip_location.region,
                        comment.ip_location.city,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                </span>
                <span>
                  终端：
                  <Popover
                    title="终端信息"
                    placement="right"
                    content={
                      <div>
                        <p>浏览器：{parseBrowser(comment.agent)}</p>
                        <div>系统：{parseOS(comment.agent)}</div>
                      </div>
                    }
                  >
                    {parseBrowser(comment.agent)}
                  </Popover>
                </span>
                <span>
                  时间：
                  {stringToYMD(comment.create_at!)}
                </span>
              </Space>
            )
          },
        },
        {
          title: '状态',
          width: 120,
          dataIndex: 'state',
          render: (_, comment) => {
            const state = cs(comment.state)
            return (
              <Space direction="vertical">
                <Tag
                  icon={<LikeOutlined />}
                  color={comment.likes > 0 ? 'red' : undefined}
                >
                  {comment.likes} 个赞
                </Tag>
                <Tag
                  icon={<DislikeOutlined />}
                  color={comment.dislikes > 0 ? 'gold' : undefined}
                >
                  {comment.dislikes} 个踩
                </Tag>
                <Tag icon={state.icon} color={state.color}>
                  {state.name}
                </Tag>
              </Space>
            )
          },
        },
        {
          title: '操作',
          width: 110,
          dataIndex: 'actions',
          render: (_, comment, index) => (
            <Space direction="vertical">
              <Button
                size="small"
                type="text"
                block={true}
                icon={<EditOutlined />}
                onClick={() => props.onDetail(comment, index)}
              >
                评论详情
              </Button>
              {comment.state === CommentState.Auditing && (
                <Button
                  size="small"
                  type="text"
                  block={true}
                  icon={<CheckOutlined />}
                  onClick={() => props.onUpdateState(comment, CommentState.Published)}
                >
                  <Typography.Text type="success">审核通过</Typography.Text>
                </Button>
              )}
              {comment.state === CommentState.Published && (
                <Button
                  size="small"
                  type="text"
                  block={true}
                  danger={true}
                  icon={<StopOutlined />}
                  onClick={() => props.onUpdateState(comment, CommentState.Spam)}
                >
                  标为垃圾
                </Button>
              )}
              {(comment.state === CommentState.Auditing ||
                comment.state === CommentState.Published) && (
                <Button
                  size="small"
                  type="text"
                  block={true}
                  danger={true}
                  icon={<DeleteOutlined />}
                  onClick={() => props.onUpdateState(comment, CommentState.Deleted)}
                >
                  移回收站
                </Button>
              )}
              {(comment.state === CommentState.Deleted ||
                comment.state === CommentState.Spam) && (
                <>
                  <Button
                    size="small"
                    type="text"
                    block={true}
                    icon={<EditOutlined />}
                    onClick={() => props.onUpdateState(comment, CommentState.Auditing)}
                  >
                    <Typography.Text type="warning">退为草稿</Typography.Text>
                  </Button>
                  <Button
                    size="small"
                    type="text"
                    danger={true}
                    block={true}
                    icon={<DeleteOutlined />}
                    onClick={() => props.onDelete(comment, index)}
                  >
                    彻底删除
                  </Button>
                </>
              )}
              <Button
                size="small"
                block={true}
                type="link"
                target="_blank"
                icon={<LinkOutlined />}
                href={getBlogURLByPostID(comment.post_id)}
              >
                宿主页面
              </Button>
            </Space>
          ),
        },
      ]}
    />
  )
}
