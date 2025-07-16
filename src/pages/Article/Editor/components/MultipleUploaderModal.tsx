import React from 'react'
import { useReactive } from 'veact'
import { Modal, message, Tooltip, Button, Upload, Card, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { copyToClipboard } from '@/utils/clipboard'
import { useUploader } from '@/hooks/useUploader'
import { imageURLToMarkdown } from '@/transforms/markdown'
import { getFileName } from '@/components/common/ImageUploader'
import styles from './style.module.less'

export interface MultipleUploaderProps {
  directory?: string
}

export const MultipleUploader: React.FC<MultipleUploaderProps> = (props) => {
  const uploader = useUploader()
  const fileUrls = useReactive<string[]>([])

  return (
    <div className={styles.multipleImageUploader}>
      {!fileUrls.length ? null : (
        <Button
          block={true}
          type="dashed"
          className={styles.copyButton}
          onClick={() => {
            copyToClipboard(fileUrls.map(imageURLToMarkdown).join(`\n`))
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
              <Icons.CopyOutlined />
            </Tooltip>
          )
        }}
        onDownload={(file) => {
          copyToClipboard(imageURLToMarkdown(file.response.url))
          message.info('复制成功')
        }}
        onPreview={(file) => {
          Modal.info({
            centered: true,
            closable: true,
            maskClosable: true,
            width: '50vw',
            modalRender: () => (
              <Card title={file.response?.key ?? ''}>
                <img style={{ width: '100%' }} src={file.response?.url} />
              </Card>
            )
          })
        }}
        customRequest={(options) => {
          if (options.file) {
            const file = options.file as File
            uploader
              .upload(file, getFileName(file, props.directory), (percent) => {
                options.onProgress?.({ percent })
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
          <Icons.UploadOutlined />
        </p>
        <p className="ant-upload-text">文件拖到这里或点击上传</p>
        <br />
      </Upload.Dragger>
    </div>
  )
}

export interface MultipleUploaderModalProps {
  open: boolean
  onClose?(): void
  uploaderDirectory?: MultipleUploaderProps['directory']
}

export const MultipleUploaderModal: React.FC<MultipleUploaderModalProps> = (props) => {
  const titleElement = (
    <Space>
      <Icons.FileImageOutlined />
      图片上传器
    </Space>
  )

  const footerElement = (
    <Button block={true} type="dashed" onClick={props.onClose}>
      OK，我已保存好所有图片地址
    </Button>
  )

  return (
    <Modal
      centered={true}
      closable={false}
      open={props.open}
      title={titleElement}
      footer={footerElement}
      styles={{
        body: {
          paddingTop: '12px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }
      }}
    >
      <MultipleUploader directory={props.uploaderDirectory} />
    </Modal>
  )
}
