/**
 * @desc General file manager
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useRef, useShallowRef, useReactive, useComputed, useWatch, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import {
  Flex,
  Button,
  Divider,
  Input,
  Select,
  Space,
  Modal,
  Typography,
  Descriptions
} from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/static'
import { StaticFileListResult, StaticFileObject } from '@/apis/static'
import { timestampToYMD } from '@/transforms/date'
import { useTranslation } from '@/i18n'
import { TableList, TableListProps } from './TableList'
import { GridList } from './GridList'
import {
  StaticListDataItem,
  transformSizeToKb,
  isImageTypeKey,
  isAudioTypeKey,
  isVideoTypeKey
} from './helper'

import styles from './style.module.less'

const PAGE_SIZES = [280, 500, 1000]

enum DisplayType {
  List = 'list',
  Grid = 'grid'
}

export interface FileManagerProps {
  initLimit?: number
  initPrefix?: string
  tableListSize?: TableListProps['size']
}

export const FileManager: React.FC<FileManagerProps> = (props) => {
  const displayType = useShallowRef<DisplayType>(DisplayType.List)
  const params = useReactive({
    limit: props.initLimit ?? PAGE_SIZES[1],
    prefix: props.initPrefix ?? ''
  })

  const modalFileObject = useShallowRef<StaticFileObject | null>(null)
  const isFileModalOpen = useComputed(() => !!modalFileObject.value)
  const openFileModal = (fileObject: StaticFileObject) => {
    modalFileObject.value = fileObject
  }
  const closeFileModal = () => {
    modalFileObject.value = null
  }

  const { i18n } = useTranslation()
  const fetching = useLoading()
  const paginateData = useShallowRef<StaticFileListResult>()
  const fileListData = useRef<StaticFileObject[]>([])
  const displayListData = useComputed<StaticListDataItem[]>(() => {
    const folderListData =
      paginateData.value?.commonPrefixes?.map((cp) => ({
        isFolder: true as const,
        prefix: cp.Prefix!,
        key: cp.Prefix!
      })) ?? []

    return [
      ...folderListData,
      ...fileListData.value.filter((f) => !(f.key.endsWith('/') && f.size === 0))
    ]
  })

  const fetchFileList = (startAfter?: string) => {
    return fetching
      .promise(
        api.getStaticFileList({
          limit: params.limit,
          prefix: params.prefix,
          delimiter: '/',
          startAfter
        })
      )
      .then((result) => {
        paginateData.value = result
        if (startAfter) {
          fileListData.value.push(...result.files)
        } else {
          fileListData.value = result.files
        }
      })
  }

  const loadFolderFileList = (prefix: string) => {
    params.prefix = prefix
    fetchFileList()
  }

  useWatch(
    () => params.limit,
    () => fetchFileList()
  )

  onMounted(() => fetchFileList())

  const renderFileModalContent = (fileObject: StaticFileObject) => {
    const renderPreview = () => {
      if (isImageTypeKey(fileObject.key)) {
        return (
          <Typography.Link href={fileObject.url} target="_blank">
            <img src={fileObject.url} alt={fileObject.key} className={styles.fileModalImage} />
          </Typography.Link>
        )
      } else if (isVideoTypeKey(fileObject.key)) {
        return <video src={fileObject.url} controls autoPlay className={styles.fileModalVideo} />
      } else if (isAudioTypeKey(fileObject.key)) {
        return <audio src={fileObject.url} controls autoPlay className={styles.fileModalAudio} />
      } else if (fileObject.key.toLowerCase().endsWith('html')) {
        return <iframe src={fileObject.url} className={styles.fileModalIframe} />
      } else if (fileObject.key.toLowerCase().endsWith('pdf')) {
        return <iframe src={fileObject.url} className={styles.fileModalPdf} />
      } else {
        return (
          <Typography.Link href={fileObject.url} target="_blank">
            新窗口打开
          </Typography.Link>
        )
      }
    }

    return (
      <Descriptions size="middle" column={2} className={styles.fileModalDescriptions}>
        <Descriptions.Item label="size">{transformSizeToKb(fileObject.size)}</Descriptions.Item>
        <Descriptions.Item label="StorageClass">{fileObject.storageClass}</Descriptions.Item>
        <Descriptions.Item label="lastModified" span={2}>
          {timestampToYMD(fileObject.lastModified!)}
        </Descriptions.Item>
        <Descriptions.Item label="ETag" span={2}>
          {fileObject.eTag}
        </Descriptions.Item>
        <Descriptions.Item span={2}>{renderPreview()}</Descriptions.Item>
      </Descriptions>
    )
  }

  return (
    <div>
      <Modal
        title={modalFileObject.value?.key ?? '文件详情'}
        centered={true}
        closable={true}
        destroyOnClose={true}
        footer={null}
        open={isFileModalOpen.value}
        onCancel={closeFileModal}
        onClose={closeFileModal}
      >
        {modalFileObject.value ? renderFileModalContent(modalFileObject.value) : null}
      </Modal>
      <Flex justify="space-between">
        <Space>
          <Select
            placeholder="每页数据"
            disabled={fetching.state.value}
            value={params.limit}
            onChange={(value) => (params.limit = value)}
            labelRender={(prop) => `每页 ${prop.value} 条数据`}
            optionRender={(prop) => `${prop.value} 条`}
            options={PAGE_SIZES.map((value) => ({ value }))}
          />
          <Input.Search
            style={{ width: 260 }}
            allowClear
            placeholder="输入前缀以过滤"
            disabled={fetching.state.value}
            value={params.prefix}
            onChange={(event) => (params.prefix = event.target.value)}
            onSearch={(_, __, info) => {
              if (info?.source === 'input') {
                fetchFileList()
              }
            }}
          />
          <Button
            icon={<Icons.ReloadOutlined />}
            loading={fetching.state.value}
            onClick={() => fetchFileList()}
          >
            {i18n.t('common.list.filter.refresh')}
          </Button>
        </Space>
        <Select
          placeholder="展示方式"
          value={displayType.value}
          onChange={(value) => (displayType.value = value)}
          options={[
            {
              value: DisplayType.List,
              label: (
                <Space size="small">
                  <Icons.UnorderedListOutlined /> 列表
                </Space>
              )
            },
            {
              value: DisplayType.Grid,
              label: (
                <Space size="small">
                  <Icons.AppstoreOutlined /> 网格
                </Space>
              )
            }
          ]}
        />
      </Flex>
      <Divider />
      {displayType.value === DisplayType.List ? (
        <TableList
          loading={fetching.state.value}
          data={displayListData.value}
          size={props.tableListSize}
          onClickFolder={loadFolderFileList}
          onClickFile={openFileModal}
        />
      ) : (
        <GridList
          loading={fetching.state.value}
          data={displayListData.value}
          onClickFolder={loadFolderFileList}
          onClickFile={openFileModal}
        />
      )}
      <br />
      {paginateData.value && (
        <Flex justify="center">
          {paginateData.value.files.length < paginateData.value.limit! ? (
            <Typography.Text type="secondary">没有更多了</Typography.Text>
          ) : (
            <Button
              size="large"
              icon={<Icons.PlusOutlined />}
              disabled={fetching.state.value}
              loading={fetching.state.value}
              onClick={() => fetchFileList(fileListData.value.at(-1)?.key)}
            >
              {fetching.state.value ? '加载中...' : '加载更多'}
            </Button>
          )}
        </Flex>
      )}
    </div>
  )
}
