import React from 'react'
import { useReactive } from 'veact'
import { Modal, message, Tooltip, Button, Upload, Card } from 'antd'
import * as Icon from '@ant-design/icons'
import { copy } from '@/services/clipboard'
import { useUploader } from '@/services/uploader'
import { imageURLToMarkdown } from '@/transforms/markdown'
import { getFileName } from '@/components/common/ImageUploader'
import styles from './style.module.less'

export interface MainMultipleUploaderProps {
  directory?: string
}

export const MainMultipleUploader: React.FC<MainMultipleUploaderProps> = (props) => {
  const uploader = useUploader()
  const fileUrls = useReactive<Array<string>>([])

  return (
    <div className={styles.mainMultipleImageUploader}>
      {!fileUrls.length ? null : (
        <Button
          block={true}
          type="dashed"
          className={styles.copyButton}
          onClick={() => {
            copy(fileUrls.map(imageURLToMarkdown).join(`\n`))
            message.info(`${fileUrls.length} 个地址 复制成功`)
          }}
        >
          复制所有图片的 Markdown 地址
        </Button>
      )}
      <Upload.Dragger
        className={styles.uploader}
        name="file"
        listType="picture"
        multiple={true}
        showUploadList={{
          showRemoveIcon: false,
          showPreviewIcon: true,
          showDownloadIcon: true,
          downloadIcon: (
            <Tooltip title="Copy Markdown">
              <Icon.CopyOutlined />
            </Tooltip>
          )
        }}
        onDownload={(file) => {
          copy(imageURLToMarkdown(file.response.url))
          message.info('复制成功')
        }}
        onPreview={(file) => {
          Modal.info({
            centered: true,
            closable: true,
            maskClosable: true,
            width: '50vw',
            modalRender: () => (
              <Card title={file.response.key}>
                <img style={{ width: '100%' }} src={file.response.url} />
              </Card>
            )
          })
        }}
        customRequest={(options) => {
          if (options.file) {
            const file = options.file as File
            uploader
              .upload(file, getFileName(file, props.directory), {
                onProgress: (percent) => options.onProgress?.({ percent })
              })
              .then((result) => {
                fileUrls.push(result.url)
                options.onSuccess?.(result)
              })
              .catch((error) => {
                options.onError?.(error)
              })
          }
        }}
      >
        <br />
        <p className="ant-upload-drag-icon">
          <Icon.UploadOutlined />
        </p>
        <p className="ant-upload-text">文件拖到这里或点击上传</p>
        <br />
      </Upload.Dragger>
    </div>
  )
}
