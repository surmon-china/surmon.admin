import React from 'react'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Spin, Button, Divider, Space, Typography } from 'antd'
import * as Icons from '@ant-design/icons'
import type { Tag } from '@/constants/tag'
import { getTags } from '@/apis/tag'

export interface MainTagSelectProps {
  value?: string[]
  onChange?(value: string[]): void
}

export const MainTagSelect: React.FC<MainTagSelectProps> = (props) => {
  const tagsLoading = useLoading()
  const tags = useRef<Tag[]>([])
  const fetchTags = () => {
    tagsLoading.promise(getTags({ per_page: 50 })).then((result) => {
      tags.value = result.data
    })
  }

  const values = props.value || []
  const handleClick = (tag: Tag, checked: boolean) => {
    const tagId = tag._id!
    const tagIds = checked ? [...values, tagId] : values.filter((t) => t !== tagId)
    props.onChange?.(tagIds)
  }

  onMounted(() => {
    fetchTags()
  })

  return (
    <Spin spinning={tagsLoading.state.value}>
      <Space wrap size={[12, 12]}>
        {!tags.value.length ? (
          <Typography.Text type="secondary">无数据</Typography.Text>
        ) : (
          tags.value.map((tag) => {
            const isChecked = values.includes(tag._id!)
            return (
              <Button
                size="small"
                key={tag._id!}
                onClick={() => handleClick(tag, !isChecked)}
                type={isChecked ? 'primary' : 'default'}
                icon={
                  isChecked ? (
                    <Icons.CheckCircleOutlined />
                  ) : (
                    <Icons.TagOutlined style={{ opacity: 0.6 }} />
                  )
                }
              >
                {tag.name}
              </Button>
            )
          })
        )}
        <Divider type="vertical" />
        <Button
          size="small"
          type="dashed"
          icon={<Icons.ReloadOutlined />}
          loading={tagsLoading.state.value}
          onClick={fetchTags}
        >
          刷新列表
        </Button>
      </Space>
    </Spin>
  )
}
