import React from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Typography, Card, Tag, Space } from 'antd'
import * as Icon from '@ant-design/icons'
import { RouteKey, rc } from '@/routes'
import { Pagination } from '@/constants/request'
import { Article } from '@/constants/article'
import { ao } from '@/constants/article/origin'
import { ap } from '@/constants/article/public'
import { PublishState, ps } from '@/constants/publish'
import { stringToYMD } from '@/transforms/date'
import { getBlogArticleUrl } from '@/transforms/url'

export interface ArticleListTableProps {
  loading: boolean
  data: Array<Article>
  pagination: Pagination
  selectedIds: Array<string>
  onSelecte(ids: Array<any>): any
  onPagination(page: number, pageSize?: number): any
  onUpdateState(comment: Article, state: PublishState): any
}
export const ArticleListTable: React.FC<ArticleListTableProps> = (props) => {
  return (
    <Table<Article>
      rowKey={(aticle) => aticle._id!}
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
          title: '文章',
          width: 360,
          dataIndex: 'content',
          render: (_, comment) => (
            <Card
              size="small"
              bordered={false}
              bodyStyle={{
                minHeight: '100px',
                backdropFilter: 'blur(2px)',
              }}
              style={{
                margin: '1rem 0',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                minHeight: '100px',
                backgroundImage: `url("${comment.thumb}")`,
                backgroundBlendMode: 'soft-light',
              }}
            >
              <Card.Meta
                title={
                  <Typography.Title style={{ marginTop: '5px' }} level={5}>
                    {comment.title}
                  </Typography.Title>
                }
                description={
                  <Typography.Paragraph
                    type="secondary"
                    style={{ marginBottom: '5px' }}
                    ellipsis={{ rows: 2, expandable: true }}
                  >
                    {comment.description}
                  </Typography.Paragraph>
                }
              />
            </Card>
          ),
        },
        {
          title: '归类',
          width: 130,
          dataIndex: 'create_at',
          render(_, article) {
            return (
              <Space direction="vertical">
                {article.category.map((category) => (
                  <Space size="small" key={category._id}>
                    <Icon.FolderOpenOutlined />
                    {category.name}
                  </Space>
                ))}
                <Space size="small" wrap={true}>
                  {article.tag.map((tag) => (
                    <Tag icon={<Icon.TagOutlined />} key={tag._id}>
                      {tag.name}
                    </Tag>
                  ))}
                </Space>
              </Space>
            )
          },
        },
        {
          title: '被关注',
          width: 150,
          dataIndex: 'create_at',
          render(_, article) {
            return (
              <Space direction="vertical">
                <Space size="small">
                  <Icon.EyeOutlined />
                  浏览 {article.meta?.views} 次
                </Space>
                <Space size="small">
                  <Icon.HeartOutlined />
                  喜欢 {article.meta?.likes} 次
                </Space>
                <Space size="small">
                  <Icon.CommentOutlined />
                  评论 {article.meta?.comments} 条
                </Space>
              </Space>
            )
          },
        },
        {
          title: '更新周期',
          width: 230,
          dataIndex: 'create_at',
          render(_, article) {
            return (
              <Space direction="vertical">
                <span>最早发布：{stringToYMD(article.create_at!)}</span>
                <span>最后更新：{stringToYMD(article.update_at!)}</span>
              </Space>
            )
          },
        },
        {
          title: '状态',
          width: 120,
          dataIndex: 'state',
          render: (_, article) => {
            return (
              <Space direction="vertical">
                {[ps(article.state), ap(article.public), ao(article.origin)].map((state) => (
                  <Tag icon={state.icon} color={state.color} key={state.id + state.name}>
                    {state.name}
                  </Tag>
                ))}
              </Space>
            )
          },
        },
        {
          title: '操作',
          width: 110,
          dataIndex: 'actions',
          render: (_, article) => (
            <Space direction="vertical">
              <Link to={rc(RouteKey.ArticleEdit).pather!(article._id!)}>
                <Button size="small" type="text" block={true} icon={<Icon.EditOutlined />}>
                  文章详情
                </Button>
              </Link>
              {article.state === PublishState.Draft && (
                <Button
                  size="small"
                  type="text"
                  block={true}
                  icon={<Icon.CheckOutlined />}
                  onClick={() => props.onUpdateState(article, PublishState.Published)}
                >
                  <Typography.Text type="success">直接发布</Typography.Text>
                </Button>
              )}
              {article.state === PublishState.Published && (
                <Button
                  size="small"
                  type="text"
                  block={true}
                  danger={true}
                  icon={<Icon.DeleteOutlined />}
                  onClick={() => props.onUpdateState(article, PublishState.Recycle)}
                >
                  移回收站
                </Button>
              )}
              {article.state === PublishState.Recycle && (
                <Button
                  size="small"
                  type="text"
                  block={true}
                  icon={<Icon.RollbackOutlined />}
                  onClick={() => props.onUpdateState(article, PublishState.Draft)}
                >
                  <Typography.Text type="warning">退至草稿</Typography.Text>
                </Button>
              )}
              <Button
                size="small"
                block={true}
                type="link"
                target="_blank"
                icon={<Icon.LinkOutlined />}
                href={getBlogArticleUrl(article.id!)}
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
