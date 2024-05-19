import React from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Typography, Card, Tag, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { RoutesPather } from '@/routes'
import { Pagination } from '@/constants/nodepress'
import {
  Article,
  getArticleOrigin,
  getArticlePublic,
  ArticlePublish,
  getArticlePublish
} from '@/constants/article'
import { getBlogArticleUrl } from '@/transforms/url'
import { numberToKilo } from '@/transforms/number'
import { stringToYMD } from '@/transforms/date'

export interface ArticleListTableProps {
  loading: boolean
  data: Article[]
  pagination: Pagination
  selectedIds: string[]
  onSelecte(ids: any[]): any
  onPaginate(page: number, pageSize?: number): any
  onUpdateState(article: Article, state: ArticlePublish): any
}

export const ArticleListTable: React.FC<ArticleListTableProps> = (props) => {
  return (
    <Table<Article>
      rowKey={(aticle) => aticle._id!}
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
          dataIndex: 'id',
          responsive: ['md']
        },
        {
          title: '文章',
          width: 360,
          dataIndex: 'content',
          render: (_, article) => (
            <Card
              size="small"
              bordered={false}
              styles={{
                body: { minHeight: '108px' }
              }}
              style={{
                margin: 'var(--app-padding-xs) 0',
                background: `linear-gradient(
                  to right bottom,
                  rgba(0, 0, 0, 0.8),
                  rgba(0, 0, 0, 0.4)
                ),
                url("${article.thumbnail}") center / cover`
              }}
            >
              <Typography.Title
                level={5}
                style={{ marginTop: 'var(--app-padding-xs)', color: 'white' }}
              >
                {article.title}
              </Typography.Title>
              <Typography.Paragraph
                style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                ellipsis={{ rows: 2, expandable: true }}
              >
                {article.description}
              </Typography.Paragraph>
            </Card>
          )
        },
        {
          title: '归类',
          width: 130,
          dataIndex: 'created_at',
          render(_, article) {
            return (
              <Space direction="vertical">
                {article.categories.map((category) => (
                  <Space size="small" key={category._id}>
                    <Icons.FolderOpenOutlined />
                    {category.name}
                  </Space>
                ))}
                <Space size="small" wrap>
                  {article.tags.map((tag) => (
                    <Tag icon={<Icons.TagOutlined />} key={tag._id}>
                      {tag.name}
                    </Tag>
                  ))}
                </Space>
              </Space>
            )
          }
        },
        {
          title: '被关注',
          width: 150,
          dataIndex: 'created_at',
          render(_, article) {
            return (
              <Space direction="vertical">
                <Space size="small">
                  <Icons.EyeOutlined />
                  浏览 {numberToKilo(article.meta?.views ?? 0)} 次
                </Space>
                <Space size="small">
                  <Icons.HeartOutlined />
                  喜欢 {article.meta?.likes} 次
                </Space>
                <Space size="small">
                  <Icons.CommentOutlined />
                  评论 {article.meta?.comments} 条
                </Space>
              </Space>
            )
          }
        },
        {
          title: '更新周期',
          width: 230,
          dataIndex: 'created_at',
          render(_, article) {
            return (
              <Space direction="vertical">
                <span>发布：{stringToYMD(article.created_at!)}</span>
                <span>更新：{stringToYMD(article.updated_at!)}</span>
              </Space>
            )
          }
        },
        {
          title: '状态',
          width: 120,
          dataIndex: 'state',
          render: (_, article) => {
            return (
              <Space direction="vertical">
                {[
                  getArticlePublish(article.state),
                  getArticlePublic(article.public),
                  getArticleOrigin(article.origin)
                ].map((state) => (
                  <Tag icon={state.icon} color={state.color} key={state.id + state.name}>
                    {state.name}
                  </Tag>
                ))}
              </Space>
            )
          }
        },
        {
          title: '操作',
          width: 110,
          dataIndex: 'actions',
          render: (_, article) => (
            <Space direction="vertical">
              <Link to={RoutesPather.articleDetail(article._id!)}>
                <Button size="small" type="text" block={true} icon={<Icons.EditOutlined />}>
                  文章详情
                </Button>
              </Link>
              {article.state === ArticlePublish.Draft && (
                <Button
                  size="small"
                  type="text"
                  block={true}
                  icon={<Icons.CheckOutlined />}
                  onClick={() => props.onUpdateState(article, ArticlePublish.Published)}
                >
                  <Typography.Text type="success">直接发布</Typography.Text>
                </Button>
              )}
              {article.state === ArticlePublish.Published && (
                <Button
                  size="small"
                  type="text"
                  block={true}
                  danger={true}
                  icon={<Icons.DeleteOutlined />}
                  onClick={() => props.onUpdateState(article, ArticlePublish.Recycle)}
                >
                  移回收站
                </Button>
              )}
              {article.state === ArticlePublish.Recycle && (
                <Button
                  size="small"
                  type="text"
                  block={true}
                  icon={<Icons.RollbackOutlined />}
                  onClick={() => props.onUpdateState(article, ArticlePublish.Draft)}
                >
                  <Typography.Text type="warning">退至草稿</Typography.Text>
                </Button>
              )}
              <Button
                size="small"
                block={true}
                type="link"
                target="_blank"
                icon={<Icons.ExportOutlined />}
                href={getBlogArticleUrl(article.id!)}
              >
                宿主页面
              </Button>
            </Space>
          )
        }
      ]}
    />
  )
}
