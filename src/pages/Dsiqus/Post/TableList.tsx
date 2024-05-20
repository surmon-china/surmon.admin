import React from 'react'
import { Table, Avatar, Typography, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { Placeholder } from '@/components/common/Placeholder'
import { UniversalText } from '@/components/common/UniversalText'
import { stringToYMD } from '@/transforms/date'

export interface TableListProps {
  loading: boolean
  data: any[]
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<any>
      rowKey="id"
      dataSource={props.data}
      loading={props.loading}
      pagination={false}
      columns={[
        {
          title: 'ID / Thread',
          dataIndex: 'id',
          width: 160,
          render: (_, item) => (
            <Space direction="vertical">
              <UniversalText text={item.id} copyable={true} type="secondary" />
              <UniversalText text={item.thread} copyable={true} />
            </Space>
          )
        },
        {
          title: 'Created at / Message',
          dataIndex: 'message',
          render: (_, item) => {
            return (
              <div>
                <Typography.Paragraph>
                  <div dangerouslySetInnerHTML={{ __html: item.message }}></div>
                </Typography.Paragraph>
                <Typography.Text type="secondary">{stringToYMD(item.createdAt)}</Typography.Text>
              </div>
            )
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
                  <strong>{item.author.name}</strong>
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
          width: 80,
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
          width: 60,
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
          width: 60,
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
          width: 110,
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
        }
      ]}
    />
  )
}
