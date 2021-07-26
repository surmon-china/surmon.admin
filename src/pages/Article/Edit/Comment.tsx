/**
 * @file Article detail comment list
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import {
  Spin,
  Row,
  Button,
  Comment,
  Divider,
  Avatar,
  Drawer,
  Empty,
  Tag,
  Typography,
} from 'antd'
import { ReloadOutlined, HeartOutlined, EditOutlined } from '@ant-design/icons'
import { cs } from '@/constants/comment'
import { CommentTree } from '@/store/comment'
import { getGravatar } from '@/transformers/gravatar'
import { stringToYMD } from '@/transformers/date'
import { parseBrowser, parseOS } from '@/transformers/ua'

interface CommentTreeListProps {
  comments: Array<CommentTree>
}
const CommentTreeList: React.FC<CommentTreeListProps> = (props) => {
  return (
    <>
      {props.comments.map((comment) => (
        <Comment
          key={comment.id}
          datetime={stringToYMD(comment.create_at!)}
          actions={[
            <Typography.Text key="time" type={comment.likes ? 'danger' : 'secondary'}>
              <HeartOutlined />
              &nbsp;
              {comment.likes} 喜欢
            </Typography.Text>,
            <span key="browser">{parseBrowser(comment.agent!)}</span>,
            <span key="os">{parseOS(comment.agent!)}</span>,
            <span key="ip">{comment.ip || '-'}</span>,
          ]}
          author={
            <div>
              {comment.author.site ? (
                <a
                  href={comment.author.site}
                  title={comment.author.site}
                  target="_blank"
                  rel="noreferrer"
                >
                  {comment.author.name}
                </a>
              ) : (
                comment.author.name
              )}
              <Divider type="vertical" />
              {comment.ip_location?.country || '-'} · {comment.ip_location?.city || '-'}
              <Divider type="vertical" />
              <Tag color={cs(comment.state).color} icon={cs(comment.state).icon}>
                {cs(comment.state).name}
              </Tag>
            </div>
          }
          avatar={
            <Avatar
              shape="square"
              size="large"
              src={getGravatar(comment.author.email!)}
              alt={comment.author.name}
            />
          }
          content={<Typography.Paragraph>{comment.content}</Typography.Paragraph>}
        >
          <Divider />
          <CommentTreeList comments={comment.children || []} />
        </Comment>
      ))}
    </>
  )
}

export interface ArticleCommentProps {
  visible: boolean
  loading: boolean
  count: number
  comments: Array<CommentTree>
  onClose(): void
  onRefresh(): void
  onManage(): void
}
export const ArticleComment: React.FC<ArticleCommentProps> = (props) => {
  const { visible, loading, count, comments } = props
  return (
    <Drawer
      width="48rem"
      title={`文章评论（${count ?? '-'}）`}
      visible={visible}
      onClose={props.onClose}
      footer={
        <Row justify="space-between" align="bottom">
          <Button
            size="small"
            type="dashed"
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={props.onRefresh}
          >
            刷新评论
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={props.onManage}
          >
            管理评论
          </Button>
        </Row>
      }
    >
      <Spin spinning={loading}>
        {!count ? (
          <Empty description="无数据" />
        ) : (
          <CommentTreeList comments={comments} />
        )}
      </Spin>
    </Drawer>
  )
}
