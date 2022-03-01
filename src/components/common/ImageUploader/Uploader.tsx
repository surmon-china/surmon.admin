/**
 * @desc General image uploader
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Upload, notification, Input, Space, Button, Tooltip } from 'antd'
import * as Icon from '@ant-design/icons'
import { getOSSUpToken, AliYunOSSUpToken } from '@/store/system'
import { useUploader, UploadErrorCode, isExpirationToken } from '@/services/uploader'
import { copy } from '@/services/clipboard'
import { imageURLToMarkdown } from '@/transforms/markdown'
import styles from './style.module.less'

export const getFileName = (file: File, directory?: string) => {
  const _directory = directory ? `${directory}/` : ''
  return `${_directory}${file.name.replace(/ /gi, '')}`
}

export interface ImageUploaderProps {
  value?: string
  onChange?(value: string): void
  directory?: string
  disabledInput?: boolean
  disabledMarkdown?: boolean
}

export const ImageUploader: React.FC<ImageUploaderProps> = (props) => {
  const loading = useLoading()
  const token = useRef<AliYunOSSUpToken | null>(null)
  const uploader = useUploader()
  const fetchToken = async () => {
    loading.promise(getOSSUpToken()).then((resultToken) => {
      token.value = resultToken
      uploader.init(resultToken)
    })
  }

  // token null | expiration > refetch token
  const beforeUpload = async (file: File) => {
    if (!token.value || isExpirationToken(token.value)) {
      await fetchToken()
    }
    return file
  }

  // 上传文件
  const uploadFile = (file: File) => {
    notification.info({
      message: '开始上传',
      description: '文件开始上传',
    })

    uploader
      .upload(file, getFileName(file, props.directory))
      .then(({ url }) => {
        props.onChange?.(url)
        notification.success({
          message: '上传成功',
          description: url,
        })
      })
      .catch((error) => {
        notification.error({
          message: '上传失败',
          description: error.code === UploadErrorCode.Failure ? String(error.error) : error.code,
        })
      })
  }

  onMounted(() => {
    fetchToken()
  })

  return (
    <Space direction="vertical" className={styles.imageUploader}>
      <Upload
        name="file"
        listType="picture-card"
        className={styles.uploader}
        maxCount={1}
        showUploadList={false}
        disabled={loading.state.value}
        beforeUpload={beforeUpload}
        onRemove={() => props.onChange?.('')}
        customRequest={(options) => {
          if (options.file) {
            uploadFile(options.file as File)
          }
        }}
      >
        {props.value ? (
          <img className={styles.image} src={props.value} alt={props.value} />
        ) : (
          <div className={styles.tigger}>
            {uploader?.uploading.state.value ? <Icon.LoadingOutlined /> : <Icon.PlusOutlined />}
            <p className={styles.uploadText}>
              {uploader?.uploading.state.value ? 'UPLOADING...' : 'UPLOAD'}
            </p>
          </div>
        )}
      </Upload>
      {!props.disabledInput && (
        <Input
          allowClear={true}
          placeholder="可以直接输入地址"
          prefix={<Icon.LinkOutlined />}
          value={props.value}
          onChange={(event) => props.onChange?.(event.target.value)}
        />
      )}
      {!props.disabledMarkdown && props.value && (
        <Input.Group compact={true}>
          <Input
            style={{ width: 'calc(100% - 32px - 1px)' }}
            placeholder="Markdown image"
            prefix={<Icon.FileMarkdownOutlined />}
            readOnly={true}
            value={imageURLToMarkdown(props.value)}
          />
          <Tooltip title="Copy Markdown">
            <Button
              icon={<Icon.CopyOutlined />}
              onClick={() => copy(imageURLToMarkdown(props.value!))}
            />
          </Tooltip>
        </Input.Group>
      )}
    </Space>
  )
}
