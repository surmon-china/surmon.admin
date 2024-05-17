import React from 'react'
import { Row, Button, List, Divider, Flex, Space, Drawer, Tag, Typography } from 'antd'
import * as Icon from '@ant-design/icons'
import { IPLocation } from '@/components/common/IPLocation'
import { UniversalText } from '@/components/common/UniversalText'
import { CommentAvatar } from '@/pages/Comment/Avatar'
import { getCommentState } from '@/constants/comment'
import { CommentTree } from '@/apis/comment'
import { stringToYMD } from '@/transforms/date'
import { parseBrowser, parseOS, parseDevice } from '@/transforms/ua'

interface CommentTreeListProps {
  comments: Array<CommentTree>
  loading?: boolean
}

const CommentTreeList: React.FC<CommentTreeListProps> = (props) => {
  const renderCommentItem = (comment: CommentTree) => (
    <Flex align="flex-start" gap="large">
      <div style={{ marginTop: 'var(--app-padding)' }}>
        <CommentAvatar size="large" comment={comment} />
      </div>
      <Space direction="vertical" style={{ flex: 1 }}>
        <Flex justify="space-between">
          <div>
            {comment.author.site ? (
              <Typography.Link
                href={comment.author.site}
                title={comment.author.site}
                target="_blank"
                rel="noreferrer"
                strong
              >
                {comment.author.name}
              </Typography.Link>
            ) : (
              <Typography.Text strong>{comment.author.name}</Typography.Text>
            )}
            <Divider type="vertical" />
            <Typography.Text type="secondary">
              <IPLocation key="ip-location" data={comment.ip_location} />
            </Typography.Text>
            <Divider type="vertical" />
            <Typography.Text key="time" type={comment.likes ? 'danger' : 'secondary'}>
              {comment.likes ? <Icon.HeartFilled /> : <Icon.HeartOutlined />} {comment.likes} 喜欢
            </Typography.Text>
            <Divider type="vertical" />
            <Typography.Text type="secondary">{stringToYMD(comment.created_at!)}</Typography.Text>
          </div>
          <Tag
            color={getCommentState(comment.state).color}
            icon={getCommentState(comment.state).icon}
          >
            {getCommentState(comment.state).name}
          </Tag>
        </Flex>
        <Typography.Paragraph style={{ margin: 0 }}>{comment.content}</Typography.Paragraph>
        <Space>
          <UniversalText
            type="secondary"
            placeholder="未知浏览器"
            text={<small>{parseBrowser(comment.agent!)}</small>}
          />
          <UniversalText
            type="secondary"
            placeholder="未知系统"
            text={<small>{parseOS(comment.agent!)}</small>}
          />
          <UniversalText
            type="secondary"
            placeholder="未知设备"
            text={<small>{parseDevice(comment.agent!)}</small>}
          />
        </Space>
        {comment.children?.length ? (
          <CommentTreeList comments={comment.children || []} loading={props.loading} />
        ) : (
          ''
        )}
      </Space>
    </Flex>
  )

  return (
    <List
      itemLayout="vertical"
      loading={props.loading}
      dataSource={props.comments}
      renderItem={(comment) => <List.Item>{renderCommentItem(comment)}</List.Item>}
    />
  )
}

export interface ArticleCommentsProps {
  visible: boolean
  loading: boolean
  count: number
  comments: Array<CommentTree>
  onClose(): void
  onRefresh(): void
  onNavigate(): void
}

export const ArticleComments: React.FC<ArticleCommentsProps> = (props) => {
  const footerElement = (
    <Row justify="space-between" align="bottom">
      <Button
        size="small"
        icon={<Icon.ReloadOutlined />}
        loading={props.loading}
        onClick={props.onRefresh}
      >
        刷新数据
      </Button>
      <Button
        size="small"
        type="primary"
        icon={<Icon.ExportOutlined />}
        onClick={props.onNavigate}
      >
        管理全部评论
      </Button>
    </Row>
  )

  return (
    <Drawer
      width="68rem"
      title={`文章评论（${props.count ?? '-'}）`}
      open={props.visible}
      onClose={props.onClose}
      footer={footerElement}
    >
      <CommentTreeList comments={props.comments ?? []} loading={props.loading} />
    </Drawer>
  )
}
