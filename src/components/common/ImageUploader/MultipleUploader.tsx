/**
 * @desc General image uploader
 * @author Surmon <https://github.com/surmon-china>
 */

import OSS from 'ali-oss'
import React from 'react'
import { useRef, onMounted, useReactive } from 'veact'
import { useLoading } from 'veact-use'
import { Modal, message, Tooltip, Spin, Button, Upload, Result, Card } from 'antd'
import * as Icon from '@ant-design/icons'
import { getOSSUpToken, AliYunOSSUpToken } from '@/store/system'
import { isExpirationToken } from '@/services/uploader'
import { copy } from '@/services/clipboard'
import { getStaticFileUrl } from '@/transforms/url'
import { imageURLToMarkdown } from '@/transforms/markdown'
import { ALIYUN_OSS_REGION, ALIYUN_OSS_BUCKET } from '@/config'
import { getFileName } from './Uploader'
import styles from './style.module.less'

export interface MultipleUploaderProps {
  directory?: string
}
export const MultipleUploader: React.FC<MultipleUploaderProps> = (props) => {
  const loading = useLoading()
  const files = useReactive<Array<string>>([])
  const token = useRef<AliYunOSSUpToken | null>(null)
  const client = useRef<OSS | null>(null)
  const fetchTokenAndInit = async () => {
    const resultToken = await loading.promise(getOSSUpToken())
    token.value = resultToken
    client.value = new OSS({
      region: ALIYUN_OSS_REGION,
      bucket: ALIYUN_OSS_BUCKET,
      accessKeyId: resultToken.AccessKeyId,
      accessKeySecret: resultToken.AccessKeySecret,
      stsToken: resultToken.SecurityToken,
      secure: true,
    })
  }

  const beforeUpload = async (file: File) => {
    if (!token.value || isExpirationToken(token.value)) {
      await fetchTokenAndInit()
    }
    return file
  }

  onMounted(() => {
    fetchTokenAndInit()
  })

  if (loading.state.value) {
    return (
      <Spin tip="OSS client initing...">
        <Card style={{ minHeight: 200 }} />
      </Spin>
    )
  }

  if (!client.value) {
    return (
      <Result
        status="warning"
        subTitle="OSS 初始化失败"
        extra={[
          <Button key="refresh" onClick={fetchTokenAndInit}>
            刷新重试
          </Button>,
        ]}
      />
    )
  }

  return (
    <div className={styles.multipleImageUploader}>
      {!files.length ? null : (
        <Button
          block={true}
          type="dashed"
          className={styles.copyButton}
          onClick={() => {
            copy(files.map((file) => imageURLToMarkdown(getStaticFileUrl(file))).join(`\n`))
            message.info(`${files.length} 个地址 复制成功`)
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
        beforeUpload={beforeUpload}
        showUploadList={{
          showRemoveIcon: false,
          showPreviewIcon: true,
          showDownloadIcon: true,
          downloadIcon: (
            <Tooltip title="Copy Markdown">
              <Icon.CopyOutlined />
            </Tooltip>
          ),
        }}
        onDownload={(file) => {
          copy(imageURLToMarkdown(getStaticFileUrl(file.response)))
          message.info('复制成功')
        }}
        onPreview={(file) => {
          Modal.info({
            centered: true,
            closable: true,
            maskClosable: true,
            width: '50vw',
            modalRender() {
              return (
                <Card title={file.response}>
                  <img style={{ width: '100%' }} src={getStaticFileUrl(file.response)} />
                </Card>
              )
            },
          })
        }}
        customRequest={(options) => {
          if (options.file) {
            const file = options.file as File
            client
              .value!.multipartUpload(getFileName(file, props.directory), file, {
                progress(percent) {
                  options.onProgress?.({ percent } as any)
                },
              })
              .then((result) => {
                files.push(result.name)
                options.onSuccess?.(result.name, result.res as any)
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
