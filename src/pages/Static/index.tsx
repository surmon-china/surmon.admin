/**
 * @file Statics page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useShallowRef } from 'veact'
import { Modal, Button, Card } from 'antd'
import * as Icons from '@ant-design/icons'
import { FileManager } from '@/components/common/FileManager'
import { useTranslation } from '@/i18n'

export const StaticPage: React.FC = () => {
  const { i18n } = useTranslation()
  const isUploaderModalOpen = useShallowRef(false)

  return (
    <Card
      bordered={false}
      title={i18n.t('page.statics.list.title', {
        total: '-'
      })}
      extra={
        <Button
          type="primary"
          size="small"
          icon={<Icons.UploadOutlined />}
          disabled
          onClick={() => (isUploaderModalOpen.value = true)}
        >
          上传新文件
        </Button>
      }
    >
      <FileManager tableListSize="middle" />
      <Modal
        title="上传文件"
        centered={true}
        closable={false}
        footer={null}
        open={isUploaderModalOpen.value}
        onClose={() => (isUploaderModalOpen.value = false)}
      >
        <p>TODO</p>
      </Modal>
    </Card>
  )
}
