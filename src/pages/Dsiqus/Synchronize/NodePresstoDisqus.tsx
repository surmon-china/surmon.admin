import React from 'react'
import { Steps, Result, Button, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { downloadNodePressXMLToDisqus } from '@/apis/disqus'

export const NodePresstoDisqus: React.FC = () => {
  return (
    <div>
      <Steps
        items={[
          {
            status: 'process',
            title: 'Export',
            subTitle: 'Export XML form NodePress database',
            icon: <Icons.CloudDownloadOutlined />
          },
          {
            status: 'process',
            title: 'Import',
            subTitle: 'Upload XML to Disqus',
            icon: <Icons.CloudUploadOutlined />
          }
        ]}
      />
      <Result
        icon={<Icons.CloudSyncOutlined />}
        title="NodePress To Disqus"
        extra={
          <Space.Compact>
            <Button
              size="large"
              type="primary"
              icon={<Icons.DownloadOutlined />}
              onClick={() => downloadNodePressXMLToDisqus()}
            >
              Download XML
            </Button>
            <Button
              size="large"
              type="primary"
              icon={<Icons.UploadOutlined />}
              target="_blank"
              href="https://import.disqus.com/"
            >
              Upload to Disqus
            </Button>
          </Space.Compact>
        }
      />
    </div>
  )
}
