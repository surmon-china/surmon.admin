import React from 'react'
import { useLoading } from 'veact-use'
import { Steps, Result, Button, Upload, Modal, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { importDisqusXMLToNodePress } from '@/apis/disqus'

export const DisqusToNodePress: React.FC = () => {
  const uploading = useLoading()
  const uploadFile = (file: File) => {
    uploading.promise(importDisqusXMLToNodePress(file)).catch((error) => {
      Modal.error({
        title: 'Upload XML error',
        content: String(error)
      })
    })
  }

  return (
    <div>
      <Steps
        items={[
          {
            status: 'process',
            title: 'Export',
            subTitle: 'Export XML form Disqus admin',
            icon: <Icons.CloudDownloadOutlined />
          },
          {
            status: 'process',
            title: 'Import',
            subTitle: 'Upload XML to NodePress',
            icon: <Icons.CloudUploadOutlined />
          }
        ]}
      />
      <Result
        icon={<Icons.CloudSyncOutlined />}
        title="Disqus To NodePress"
        extra={
          <Space>
            <Button
              size="large"
              type="primary"
              icon={<Icons.DownloadOutlined />}
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
                icon={<Icons.UploadOutlined />}
              >
                Upload XML to NodePress
              </Button>
            </Upload>
          </Space>
        }
      />
    </div>
  )
}
