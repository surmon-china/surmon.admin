/**
 * @file Announcement page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useLoading } from 'veact-use'
import {
  useShallowReactive,
  useRef,
  onMounted,
  useReactive,
  batchedUpdates,
  useWatch,
  useComputed
} from 'veact'
import { Table, Button, Card, Input, Tag, Select, Divider, Spin, Modal, Space } from 'antd'
import * as Icon from '@ant-design/icons'
import * as api from '@/apis/announcement'
import type { GetAnnouncementsParams } from '@/apis/announcement'
import { useTranslation } from '@/i18n'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { Announcement as AnnouncementType } from '@/constants/announcement'
import { ResponsePaginationData } from '@/constants/nodepress'
import { PublishState, getPublishState } from '@/constants/publish'
import { scrollTo } from '@/services/scroller'
import { stringToYMD } from '@/transforms/date'
import { EditModal } from './EditModal'

import styles from './style.module.less'

export const STATE_IDS = [PublishState.Draft, PublishState.Published]

const SELECT_ALL_VALUE = 'ALL'

export const AnnouncementPage: React.FC = () => {
  const loading = useLoading()
  const submitting = useLoading()
  const { i18n } = useTranslation()
  const announcement = useShallowReactive<ResponsePaginationData<AnnouncementType>>({
    data: [],
    pagination: undefined
  })

  // 多选
  const selectedIDs = useRef<Array<string>>([])
  const handleSelect = (ids: any[]) => {
    selectedIDs.value = ids
  }

  // 过滤参数
  const filterParams = useReactive({
    state: SELECT_ALL_VALUE as typeof SELECT_ALL_VALUE | PublishState,
    keyword: ''
  })

  // 弹窗
  const activeEditDataIndex = useRef<number | null>(null)
  const isVisibleModal = useRef(false)
  const activeEditData = useComputed(() => {
    const index = activeEditDataIndex.value
    return index !== null ? announcement.data[index] : null
  })
  const closeModal = () => {
    isVisibleModal.value = false
  }
  // 编辑创建
  const editData = (index: number) => {
    activeEditDataIndex.value = index
    isVisibleModal.value = true
  }
  const createNewData = () => {
    activeEditDataIndex.value = null
    isVisibleModal.value = true
  }

  const fetchData = (params?: GetAnnouncementsParams) => {
    const getParams: GetAnnouncementsParams = {
      ...params,
      state: filterParams.state !== SELECT_ALL_VALUE ? filterParams.state : undefined,
      keyword: Boolean(filterParams.keyword) ? filterParams.keyword : undefined
    }

    loading.promise(api.getAnnouncements(getParams)).then((response) => {
      batchedUpdates(() => {
        announcement.data = response.data
        announcement.pagination = response.pagination
      })
      scrollTo(document.body)
    })
  }

  const resetParamsAndRefresh = () => {
    filterParams.keyword = ''
    if (filterParams.state === SELECT_ALL_VALUE) {
      fetchData()
    } else {
      filterParams.state = SELECT_ALL_VALUE
    }
  }

  const refreshData = () => {
    fetchData({
      page: announcement.pagination?.current_page,
      per_page: announcement.pagination?.per_page
    })
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确定要删除公告吗？',
      content: '删除后不可恢复',
      centered: true,
      onOk: () =>
        api.deleteAnnouncement(id).then(() => {
          refreshData()
        })
    })
  }

  const handleDeleteList = () => {
    const ids = selectedIDs.value
    Modal.confirm({
      title: `确定要删除 ${ids.length} 个公告吗？`,
      content: '删除后不可恢复',
      centered: true,
      onOk: () =>
        api.deleteAnnouncements(ids).then(() => {
          refreshData()
        })
    })
  }

  const handleSubmit = (announcement: AnnouncementType) => {
    if (activeEditData.value) {
      submitting
        .promise(
          api.putAnnouncement({
            ...activeEditData.value,
            ...announcement
          })
        )
        .then(() => {
          closeModal()
          refreshData()
        })
    } else {
      submitting.promise(api.createAnnouncement(announcement)).then(() => {
        closeModal()
        refreshData()
      })
    }
  }

  useWatch(
    () => filterParams.state,
    () => fetchData()
  )

  onMounted(() => {
    fetchData()
  })

  return (
    <Card
      bordered={false}
      className={styles.announcement}
      title={i18n.t('page.announcement.list.title', {
        total: announcement.pagination?.total ?? '-'
      })}
      extra={
        <Button type="primary" size="small" icon={<Icon.PlusOutlined />} onClick={createNewData}>
          发布新公告
        </Button>
      }
    >
      <Space className={styles.toolbar} align="center" wrap>
        <Space wrap>
          <Select
            className={styles.select}
            loading={loading.state.value}
            value={filterParams.state}
            onChange={(state) => {
              filterParams.state = state
            }}
            options={[
              { label: '全部状态', value: SELECT_ALL_VALUE },
              ...STATE_IDS.map((state) => {
                const target = getPublishState(state)
                return {
                  value: target.id,
                  label: (
                    <Space>
                      {target.icon}
                      {target.name}
                    </Space>
                  )
                }
              })
            ]}
          />
          <Input.Search
            className={styles.search}
            placeholder={i18n.t('common.list.filter.search')}
            loading={loading.state.value}
            onSearch={() => fetchData()}
            value={filterParams.keyword}
            onChange={(event) => {
              filterParams.keyword = event.target.value
            }}
          />
          <Button
            icon={<Icon.ReloadOutlined />}
            loading={loading.state.value}
            onClick={() => resetParamsAndRefresh()}
          >
            {i18n.t('common.list.filter.reset_and_refresh')}
          </Button>
        </Space>
        <Space>
          <DropdownMenu
            text="批量操作"
            disabled={!selectedIDs.value.length}
            options={[
              {
                label: '批量删除',
                icon: <Icon.DeleteOutlined />,
                onClick: handleDeleteList
              }
            ]}
          />
        </Space>
      </Space>
      <Divider />
      <Spin spinning={loading.state.value}>
        <Table<AnnouncementType>
          rowKey="_id"
          dataSource={announcement.data}
          rowSelection={{
            selectedRowKeys: selectedIDs.value,
            onChange: handleSelect
          }}
          pagination={{
            pageSizeOptions: ['10', '20', '50'],
            current: announcement.pagination?.current_page,
            pageSize: announcement.pagination?.per_page,
            total: announcement.pagination?.total,
            showSizeChanger: true,
            onChange(page, pageSize) {
              return fetchData({ page, per_page: pageSize })
            }
          }}
          columns={[
            {
              title: 'ID',
              width: 60,
              dataIndex: 'id',
              responsive: ['md']
            },
            {
              title: '内容',
              dataIndex: 'content'
            },
            {
              title: '发布时间',
              dataIndex: 'created_at',
              width: 180,
              render: (_, ann) => stringToYMD(ann.created_at)
            },
            {
              title: '状态',
              width: 120,
              dataIndex: 'state',
              render: (_, ann) => {
                const state = getPublishState(ann.state)
                return (
                  <Tag icon={state.icon} color={state.color}>
                    {state.name}
                  </Tag>
                )
              }
            },
            {
              title: '操作',
              width: 160,
              dataIndex: 'actions',
              render: (_, ann, index) => (
                <Button.Group size="small">
                  <Button
                    type="text"
                    icon={<Icon.EditOutlined />}
                    onClick={() => editData(index)}
                  >
                    编辑
                  </Button>
                  <Button
                    type="text"
                    danger={true}
                    icon={<Icon.DeleteOutlined />}
                    onClick={() => handleDelete(ann._id!)}
                  >
                    删除
                  </Button>
                </Button.Group>
              )
            }
          ]}
        />
      </Spin>
      <EditModal
        title={activeEditData.value ? '编辑公告' : '新公告'}
        loading={submitting.state.value}
        visible={isVisibleModal}
        announcement={activeEditData}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Card>
  )
}
