/**
 * @file Thread list page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useShallowReactive, onMounted, useRef, useWatch } from 'veact'
import { useLoading } from 'veact-use'
import classnames from 'classnames'
import { Button, Card, Table, Select, Tag, Space, Switch, Divider, Typography } from 'antd'
import * as Icons from '@ant-design/icons'
import { DisqusThreadState, DisqusOrderType } from '@/constants/disqus'
import { getDisqusConfig, getDisqusThreads, GeneralDisqusParams } from '@/apis/disqus'
import { stringToYMD } from '@/transforms/date'
import { scrollTo } from '@/services/scroller'

import styles from './style.module.less'

const SELECT_ALL_VALUE = 'ALL'

export const DisqusThreadsPage: React.FC = () => {
  const config = useRef<any>(null)
  const fetching = useLoading()
  const threads = useShallowReactive({
    cursor: null as any,
    list: [] as any[]
  })

  // https://disqus.com/api/docs/threads/list/
  const filterParams = useShallowReactive({
    order: DisqusOrderType.Desc,
    include: SELECT_ALL_VALUE as any as DisqusThreadState | typeof SELECT_ALL_VALUE
  })

  const fetchData = (params?: GeneralDisqusParams) => {
    const getParams = {
      ...params,
      limit: 50,
      forum: config.value!.forum,
      order: filterParams.order,
      include:
        filterParams.include !== SELECT_ALL_VALUE
          ? [filterParams.include]
          : [...Object.values(DisqusThreadState)]
    }

    fetching.promise(getDisqusThreads(getParams)).then((response) => {
      threads.cursor = response.result.cursor
      if (params?.cursor) {
        threads.list.push(...response.result.response)
      } else {
        threads.list = response.result.response
        scrollTo(document.body)
      }
    })
  }

  const resetFetch = () => {
    filterParams.order = DisqusOrderType.Desc
    filterParams.include = SELECT_ALL_VALUE
    fetchData()
  }

  const loadNextPage = () => {
    fetchData({ cursor: threads.cursor.next })
  }

  useWatch(filterParams, () => fetchData())

  onMounted(() => {
    getDisqusConfig().then((response) => {
      config.value = response.result
      fetchData()
    })
  })

  return (
    <Card
      title={`Threads (${threads.list.length})`}
      bordered={false}
      className={styles.threads}
      extra={
        <Button
          type="primary"
          size="small"
          target="_blank"
          icon={<Icons.DashboardOutlined />}
          href={`https://${config.value?.forum}.disqus.com/admin/discussions/`}
        >
          Disqus Discussions
        </Button>
      }
    >
      <Space wrap>
        <Select
          className={classnames(styles.select)}
          loading={fetching.state.value}
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
              value: DisqusThreadState.Open,
              label: 'Open'
            },
            {
              value: DisqusThreadState.Closed,
              label: 'Closed'
            }
          ]}
        />
        <Select
          className={classnames(styles.select)}
          loading={fetching.state.value}
          value={filterParams.order}
          onChange={(order) => {
            filterParams.order = order
          }}
          options={[
            {
              value: DisqusOrderType.Desc,
              label: 'Desc'
            },
            {
              value: DisqusOrderType.Asc,
              label: 'Asc'
            }
          ]}
        />
        <Button
          icon={<Icons.ReloadOutlined />}
          loading={fetching.state.value}
          onClick={() => resetFetch()}
        >
          Reset refresh
        </Button>
      </Space>
      <Divider />
      <Table
        rowKey="id"
        dataSource={threads.list.slice()}
        pagination={false}
        loading={fetching.state.value}
        columns={[
          {
            title: 'Title / Link',
            key: 'title',
            render: (_, item) => {
              return (
                <Space direction="vertical">
                  <Typography.Link
                    href={`https://disqus.com/home/discussion/${item.forum}/${item.slug}/`}
                    target="_blank"
                    strong
                  >
                    {item.title}
                  </Typography.Link>
                  <Typography.Link href={item.link} target="_blank" type="secondary">
                    {item.link}
                  </Typography.Link>
                </Space>
              )
            }
          },
          {
            title: 'ID / Author',
            key: 'id',
            render: (_, item) => (
              <Space direction="vertical">
                <Typography.Text copyable={true}>{item.id}</Typography.Text>
                <Typography.Text copyable={true} type="secondary">
                  {item.author}
                </Typography.Text>
              </Space>
            )
          },
          {
            title: 'Identifiers',
            key: 'identifiers',
            render: (_, item) => (
              <Space>
                {item.identifiers.map((i: any) => (
                  <Tag key={i}>{i}</Tag>
                ))}
              </Space>
            )
          },
          {
            title: 'Posts',
            dataIndex: 'posts',
            render: (_, item) => (
              <Space size="small">
                <Icons.CommentOutlined />
                {item.posts}
              </Space>
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
            title: 'Score',
            dataIndex: 'userScore'
          },
          {
            title: 'State',
            dataIndex: 'isClosed',
            render: (_, item) => (
              <Switch
                disabled={true}
                checked={!item.isClosed}
                checkedChildren="Open"
                unCheckedChildren="Closed"
              />
            )
          },
          {
            title: 'Create at',
            dataIndex: 'createdAt',
            render: (_, item) => stringToYMD(item.createdAt)
          }
        ]}
      />
      <div className={styles.loadmore}>
        {threads.cursor?.hasNext ? (
          <Button
            size="large"
            disabled={fetching.state.value}
            loading={fetching.state.value}
            onClick={loadNextPage}
          >
            {fetching.state.value ? 'Loading...' : 'Loadmore'}
          </Button>
        ) : (
          <span>NO MORE</span>
        )}
      </div>
    </Card>
  )
}
