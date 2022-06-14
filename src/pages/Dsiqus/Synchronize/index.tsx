/**
 * @file Disqus synchornize page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useLoading } from 'veact-use'
import { Card, Steps, Space, Result, Button, Upload, Modal } from 'antd'
import * as Icon from '@ant-design/icons'
import { downloadNodePressXMLToDisqus, importDisqusXMLToNodePress } from '@/store/disqus'
import { APP_LAYOUT_SPACE_SIZE } from '@/config'

import styles from './style.module.less'

export const DisqusSynchronizePage: React.FC = () => {
  const uploading = useLoading()
  const uploadFile = (file: File) => {
    uploading.promise(importDisqusXMLToNodePress(file)).catch((error) => {
      Modal.error({
        title: 'Upload XML error',
        content: String(error),
      })
    })
  }

  return (
    <Space direction="vertical" size={APP_LAYOUT_SPACE_SIZE} className={styles.synchornize}>
      <Card title="Synchronize NodePress to Disqus" bordered={false}>
        <Steps>
          <Steps.Step
            status="process"
            title="Export"
            subTitle="Export XML form NodePress database"
            icon={<Icon.CloudDownloadOutlined />}
          />
          <Steps.Step
            status="process"
            title="Import"
            subTitle="Upload XML to Disqus"
            icon={<Icon.CloudUploadOutlined />}
          />
        </Steps>
        <Result
          icon={<Icon.CloudSyncOutlined />}
          title="NodePress To Disqus"
          extra={
            <Button.Group>
              <Button
                size="large"
                type="primary"
                icon={<Icon.DownloadOutlined />}
                onClick={() => downloadNodePressXMLToDisqus()}
              >
                Download XML
              </Button>
              <Button
                size="large"
                type="primary"
                icon={<Icon.UploadOutlined />}
                target="_blank"
                href="https://import.disqus.com/"
              >
                Upload to Disqus
              </Button>
            </Button.Group>
          }
        />
      </Card>
      <Card title="Synchronize Disqus To NodePress" bordered={false}>
        <Steps>
          <Steps.Step
            status="process"
            title="Export"
            subTitle="Export XML form Disqus admin"
            icon={<Icon.CloudDownloadOutlined />}
          />
          <Steps.Step
            status="process"
            title="Import"
            subTitle="Upload XML to NodePress"
            icon={<Icon.CloudUploadOutlined />}
          />
        </Steps>
        <Result
          icon={<Icon.CloudSyncOutlined />}
          title="Disqus To NodePress"
          extra={
            <Button.Group>
              <Button
                size="large"
                type="primary"
                icon={<Icon.DownloadOutlined />}
                target="_blank"
                href="https://help.disqus.com/en/articles/1717164-comments-export"
              >
                Export XML from Disqus
              </Button>
              <Upload
                name="file"
                showUploadList={false}
                customRequest={(options) => {
                  if (options.file) {
                    uploadFile(options.file as File)
                  }
                }}
              >
                <Button
                  size="large"
                  type="primary"
                  loading={uploading.state.value}
                  disabled={uploading.state.value}
                  icon={<Icon.UploadOutlined />}
                >
                  Upload XML to NodePress
                </Button>
              </Upload>
            </Button.Group>
          }
        />
      </Card>
    </Space>
  )
}
