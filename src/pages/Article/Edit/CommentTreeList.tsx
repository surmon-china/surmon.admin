import React from 'react'
import { List, Divider, Flex, Space, Tag, Typography } from 'antd'
import * as Icons from '@ant-design/icons'
import { IPLocation } from '@/components/common/IPLocation'
import { UniversalText } from '@/components/common/UniversalText'
import { CommentAvatar } from '@/pages/Comment/Avatar'
import { getCommentState } from '@/constants/comment'
import { CommentTree } from '@/apis/comment'
import { stringToYMD } from '@/transforms/date'
import { parseBrowser, parseOS, parseDevice } from '@/transforms/ua'

export interface CommentTreeListProps {
  comments: CommentTree[]
  loading?: boolean
}

export const CommentTreeList: React.FC<CommentTreeListProps> = (props) => {
  return (
    <List
      itemLayout="vertical"
      loading={props.loading}
      dataSource={props.comments}
      renderItem={(comment) => (
        <List.Item>
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
                    {comment.likes ? <Icons.HeartFilled /> : <Icons.HeartOutlined />}{' '}
                    {comment.likes} 喜欢
                  </Typography.Text>
                  <Divider type="vertical" />
                  <Typography.Text type="secondary">
                    {stringToYMD(comment.created_at!)}
                  </Typography.Text>
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
                <CommentTreeList comments={comment.children || []} />
              ) : (
                ''
              )}
            </Space>
          </Flex>
        </List.Item>
      )}
    />
  )
}
