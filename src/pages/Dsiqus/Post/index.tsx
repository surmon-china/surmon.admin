/**
 * @file Post list page
 * @author Surmon <https://github.com/surmon-china>
 */

import classnames from 'classnames'
import React from 'react'
import { useShallowReactive, onMounted, useRef, useWatch } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Table, Select, Input, Space, Divider, Typography, Avatar } from 'antd'
import * as Icons from '@ant-design/icons'
import { Placeholder } from '@/components/common/Placeholder'
import { UniversalText } from '@/components/common/UniversalText'
import { getConfig, getPosts, PostState, OrderType, GeneralDisqusParams } from '@/apis/disqus'
import { scrollTo } from '@/services/scroller'
import { stringToYMD } from '@/transforms/date'

import styles from './style.module.less'

// https://disqus.com/api/docs/posts/list/
const SELECT_ALL_VALUE = 'ALL'
const DEFAULT_THREAD_ID = ''
const DEFAULT_PARAMS = Object.freeze({
  order: OrderType.Desc,
  include: SELECT_ALL_VALUE as any as PostState | typeof SELECT_ALL_VALUE
})

export const DisqusPostsPage: React.FC = () => {
  const config = useRef<any>(null)
  const loading = useLoading()
  const threadId = useRef(DEFAULT_THREAD_ID)
  const filterParams = useShallowReactive({ ...DEFAULT_PARAMS })
  const posts = useShallowReactive({
    cursor: null as any,
    list: [] as any[]
  })

  const fetchData = (params?: GeneralDisqusParams) => {
    const getParams = {
      ...params,
      limit: 50,
      forum: config.value!.forum,
      order: filterParams.order,
      thread: threadId.value ? threadId.value : null,
      include:
        filterParams.include !== SELECT_ALL_VALUE
          ? [filterParams.include]
          : [...Object.values(PostState)]
    }

    loading.promise(getPosts(getParams)).then((response) => {
      posts.cursor = response.result.cursor
      if (params?.cursor) {
        posts.list.push(...response.result.response)
      } else {
        posts.list = response.result.response
        scrollTo(document.body)
      }
    })
  }

  const resetFetch = () => {
    threadId.value = DEFAULT_THREAD_ID
    filterParams.order = DEFAULT_PARAMS.order
    filterParams.include = DEFAULT_PARAMS.include
    fetchData()
  }

  const loadNextPage = () => {
    fetchData({ cursor: posts.cursor.next })
  }

  useWatch(filterParams, () => fetchData())

  onMounted(() => {
    getConfig().then((response) => {
      config.value = response.result
      fetchData()
    })
  })

  return (
    <Card
      title={`Posts (${posts.list.length})`}
      bordered={false}
      className={styles.posts}
      extra={
        <Button
          type="primary"
          size="small"
          target="_blank"
          icon={<Icons.DashboardOutlined />}
          href={`https://${config.value?.forum}.disqus.com/admin/moderate/all/`}
        >
          Disqus Moderate
        </Button>
      }
    >
      <Space wrap>
        <Select
          className={classnames(styles.select)}
          loading={loading.state.value}
          value={filterParams.include}
          onChange={(state) => {
            filterParams.include = state
          }}
          options={[
            {
              value: SELECT_ALL_VALUE,
              label: 'All state'
            },
            {
              value: PostState.Approved,
              label: 'Approved'
            },
            {
              value: PostState.Unapproved,
              label: 'Unapproved'
            },
            {
              value: PostState.Spam,
              label: 'Spam'
            },
            {
              value: PostState.Deleted,
              label: 'Deleted'
            },
            {
              value: PostState.Flagged,
              label: 'Flagged'
            },
            {
              value: PostState.Highlighted,
              label: 'Highlighted'
            }
          ]}
        />
        <Select
          className={classnames(styles.select)}
          loading={loading.state.value}
          value={filterParams.order}
          onChange={(order) => {
            filterParams.order = order
          }}
          options={[
            {
              value: OrderType.Desc,
              label: 'Desc'
            },
            {
              value: OrderType.Asc,
              label: 'Asc'
            }
          ]}
        />
        <Input.Search
          className={styles.search}
          placeholder="thread ID"
          loading={loading.state.value}
          allowClear={true}
          onSearch={() => fetchData()}
          value={threadId.value}
          onChange={(event) => {
            threadId.value = event.target.value.trim()
          }}
        />
        <Button
          icon={<Icons.ReloadOutlined />}
          loading={loading.state.value}
          onClick={() => resetFetch()}
        >
          Reset refresh
        </Button>
      </Space>
      <Divider />
      <Table
        rowKey="id"
        dataSource={posts.list.slice()}
        pagination={false}
        loading={loading.state.value}
        columns={[
          {
            title: 'ID / PID / Thread',
            dataIndex: 'id',
            width: 160,
            render: (_, item) => (
              <Space direction="vertical">
                <UniversalText text={item.id} copyable={true} type="secondary" />
                <UniversalText text={item.parent} copyable={true} type="secondary" />
                <UniversalText text={item.thread} copyable={true} />
              </Space>
            )
          },
          {
            title: 'Message',
            dataIndex: 'message',
            width: 450,
            render: (_, item) => {
              return <div dangerouslySetInnerHTML={{ __html: item.message }}></div>
            }
          },
          {
            title: 'Author',
            key: 'author',
            width: 138,
            render: (_, item) => {
              return (
                <Space>
                  <Avatar size={38} shape="square" src={item.author.avatar.cache} />
                  <Space direction="vertical" size="small">
                    <span>{item.author.name}</span>
                    <Placeholder data={item.author.url}>
                      {(url) => (
                        <Typography.Link href={url} target="_blank">
                          homepage
                        </Typography.Link>
                      )}
                    </Placeholder>
                  </Space>
                </Space>
              )
            }
          },
          {
            title: 'Role',
            key: 'author.isAnonymous',
            render: (_, item) =>
              item.author.isAnonymous ? (
                <Typography.Text type="secondary">Guest</Typography.Text>
              ) : (
                <Typography.Text type="success">Disqus</Typography.Text>
              )
          },
          {
            title: 'Likes',
            key: 'likes',
            render: (_, item) => (
              <Space size="small">
                <Icons.LikeOutlined />
                {item.likes}
              </Space>
            )
          },
          {
            title: 'Dislikes',
            key: 'dislikes',
            render: (_, item) => (
              <Space size="small">
                <Icons.DislikeOutlined />
                {item.dislikes}
              </Space>
            )
          },
          {
            title: 'State',
            dataIndex: 'isApproved',
            width: 120,
            render: (_, item) => (
              <div>
                {[
                  {
                    value: item.isApproved,
                    label: 'Approved',
                    state: 'success',
                    icon: <Icons.CheckCircleOutlined />
                  },
                  {
                    value: item.isDeleted,
                    label: 'Deleted',
                    state: 'danger',
                    icon: <Icons.CloseCircleOutlined />
                  },
                  {
                    value: item.isSpam,
                    label: 'SPAM',
                    state: 'danger',
                    icon: <Icons.CloseCircleOutlined />
                  }
                ]
                  .filter((i) => i.value)
                  .map((i, index) => (
                    <Typography.Text key={index} type={i.state as any}>
                      {i.icon}
                      &nbsp;
                      {i.label}
                    </Typography.Text>
                  ))}
              </div>
            )
          },
          {
            title: 'Create at',
            dataIndex: 'createdAt',
            width: 160,
            render: (_, item) => stringToYMD(item.createdAt)
          }
        ]}
      />
      <div className={styles.loadmore}>
        {posts.cursor?.hasNext ? (
          <Button
            size="large"
            disabled={loading.state.value}
            loading={loading.state.value}
            onClick={loadNextPage}
          >
            {loading.state.value ? 'Loading...' : 'Loadmore'}
          </Button>
        ) : (
          <span>NO MORE</span>
        )}
      </div>
    </Card>
  )
}
