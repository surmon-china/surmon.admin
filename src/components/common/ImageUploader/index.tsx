/**
 * @desc General image uploader
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Upload, notification, Input, Space, Button, Tooltip } from 'antd'
import * as Icons from '@ant-design/icons'
import { useTranslation } from '@/i18n'
import { useUploader, UploadErrorCode } from '@/hooks/useUploader'
import { imageURLToMarkdown } from '@/transforms/markdown'
import { copyToClipboard } from '@/utils/clipboard'

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
  const { i18n } = useTranslation()
  const uploader = useUploader()
  const uploadFile = (file: File) => {
    notification.info({
      message: i18n.t('component.image_uploader.state.start'),
      description: file.name
    })

    uploader
      .upload(file, getFileName(file, props.directory))
      .then((result) => {
        props.onChange?.(result.url)
        notification.success({
          message: i18n.t('component.image_uploader.state.succeeded'),
          description: result.key
        })
      })
      .catch((error) => {
        notification.error({
          message: i18n.t('component.image_uploader.state.failed'),
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
        disabled={uploader.uploading.state.value}
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
          <Space className={styles.tigger} direction="vertical" align="center" size="small">
            {uploader?.uploading.state.value ? <Icons.LoadingOutlined /> : <Icons.PlusOutlined />}
            {uploader?.uploading.state.value ? 'UPLOADING...' : 'UPLOAD'}
          </Space>
        )}
      </Upload>
      {!props.disabledInput && (
        <Input
          allowClear={true}
          placeholder={i18n.t('component.image_uploader.input.placeholder')}
          prefix={<Icons.LinkOutlined />}
          value={props.value}
          onChange={(event) => props.onChange?.(event.target.value)}
        />
      )}
      {!props.disabledMarkdown && props.value && (
        <Space.Compact className={styles.copyMarkdown}>
          <Input
            style={{ width: 'calc(100% - 32px - 1px)' }}
            readOnly={true}
            placeholder="Markdown image"
            prefix={<Icons.FileMarkdownOutlined />}
            value={imageURLToMarkdown(props.value)}
          />
          <Tooltip title="Copy Markdown">
            <Button
              icon={<Icons.CopyOutlined />}
              onClick={() => copyToClipboard(imageURLToMarkdown(props.value!))}
            />
          </Tooltip>
        </Space.Compact>
      )}
    </Space>
  )
}
