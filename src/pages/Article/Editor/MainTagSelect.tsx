import React from 'react'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Spin, Button, Divider, Space, Typography } from 'antd'
import * as Icon from '@ant-design/icons'
import type { Tag } from '@/constants/tag'
import { getTags } from '@/apis/tag'

export interface MainTagSelectProps {
  value?: Array<string>
  onChange?(value: Array<string>): void
}

export const MainTagSelect: React.FC<MainTagSelectProps> = (props) => {
  const tagsLoading = useLoading()
  const tags = useRef<Array<Tag>>([])
  const fetchTags = () => {
    tagsLoading.promise(getTags({ per_page: 50 })).then((result) => {
      tags.value = result.data
    })
  }

  const values = props.value || []
  const handleClick = (tag: Tag, checked: boolean) => {
    const tagID = tag._id!
    const tagIDs = checked ? [...values, tagID] : values.filter((t) => t !== tagID)
    props.onChange?.(tagIDs)
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
                    <Icon.CheckCircleOutlined />
                  ) : (
                    <Icon.TagOutlined style={{ opacity: 0.6 }} />
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
          icon={<Icon.ReloadOutlined />}
          loading={tagsLoading.state.value}
          onClick={fetchTags}
        >
          刷新列表
        </Button>
      </Space>
    </Spin>
  )
}