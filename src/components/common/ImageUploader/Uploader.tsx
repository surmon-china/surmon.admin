/**
 * @desc General image uploader
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useLoading } from 'veact-use'
import { Upload, notification, Input, Space, Button, Tooltip } from 'antd'
import * as Icon from '@ant-design/icons'
import { copy } from '@/services/clipboard'
import { useUploader, UploadErrorCode } from '@/services/uploader'
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
  const uploader = useUploader()
  const uploadFile = (file: File) => {
    notification.info({
      message: '开始上传',
      description: '文件开始上传'
    })

    uploader
      .upload(file, getFileName(file, props.directory))
      .then((result) => {
        props.onChange?.(result.url)
        notification.success({
          message: '上传成功',
          description: result.key
        })
      })
      .catch((error) => {
        notification.error({
          message: '上传失败',
          description:
            error.code === UploadErrorCode.Failure
              ? String(error.error?.message ?? error.error)
              : error.code
        })
      })
  }

  return (
    <Space direction="vertical" className={styles.imageUploader}>
      <Upload
        name="file"
        listType="picture-card"
        className={styles.uploader}
        maxCount={1}
        showUploadList={false}
        disabled={loading.state.value}
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
