import React from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Typography, Badge, Card, Tag, Space, Divider } from 'antd'
import * as Icons from '@ant-design/icons'
import { APP_PRIMARY_COLOR } from '@/config'
import { RoutesPather } from '@/routes'
import { Pagination } from '@/constants/nodepress'
import { Tag as TagType } from '@/constants/tag'
import { Category } from '@/constants/category'
import { Article, ArticlePublish } from '@/constants/article'
import { getArticleOrigin, getArticlePublic, getArticlePublish } from '@/constants/article'
import { getBlogArticleUrl } from '@/transforms/url'
import { numberToKilo } from '@/transforms/number'
import { stringToYMD } from '@/transforms/date'

export interface TableListProps {
  loading: boolean
  data: Article[]
  pagination: Pagination
  selectedIds: string[]
  onSelect(ids: any[]): void
  onPaginate(page: number, pageSize?: number): void
  onUpdateState(article: Article, state: ArticlePublish): void
  onClickCategory(category: Category): void
  onClickTag(tag: TagType): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<Article>
      rowKey={(aticle) => aticle._id!}
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
          dataIndex: 'title',
          render: (_, article) => (
            <Badge.Ribbon
              color={article.featured ? APP_PRIMARY_COLOR : 'transparent'}
              text={article.featured ? '精选' : null}
            >
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
            </Badge.Ribbon>
          )
        },
        {
          title: '标签',
          width: 110,
          dataIndex: 'tags',
          render(_, article) {
            return (
              <Space direction="vertical" size="small" wrap>
                {article.tags.map((tag) => (
                  <Tag
                    key={tag._id}
                    style={{ cursor: 'pointer' }}
                    icon={<Icons.TagOutlined />}
                    onClick={() => props.onClickTag(tag)}
                  >
                    {tag.name}
                  </Tag>
                ))}
              </Space>
            )
          }
        },
        {
          title: '被关注',
          width: 150,
          dataIndex: 'meta',
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
          title: '分类 / 更新周期',
          width: 220,
          dataIndex: 'created_at',
          render(_, article) {
            return (
              <Space direction="vertical">
                <div>
                  分类：
                  {article.categories.map((category, index) => (
                    <span key={index}>
                      <Typography.Link onClick={() => props.onClickCategory(category)}>
                        {category.name}
                      </Typography.Link>
                      {article.categories[index + 1] ? <Divider type="vertical" /> : ''}
                    </span>
                  ))}
                </div>
                <div>发布：{stringToYMD(article.created_at!)}</div>
                <div>更新：{stringToYMD(article.updated_at!)}</div>
              </Space>
            )
          }
        },
        {
          title: '状态',
          width: 100,
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
