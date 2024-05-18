import React from 'react'
import { useLoading } from 'veact-use'
import { Button, Row, Divider, Modal } from 'antd'
import * as Icon from '@ant-design/icons'
import { updateDatabaseBackup, updateArchiveCache } from '@/apis/system'

export const DataForm: React.FC = () => {
  const databaseLoading = useLoading()
  const archiveLoading = useLoading()

  const handleUpdateDatabaseBackup = () => {
    Modal.confirm({
      centered: true,
      title: '更新备份会导致强制覆盖旧的数据库备份，确定要继续吗？',
      onOk: () => databaseLoading.promise(updateDatabaseBackup())
    })
  }

  const handleUpdateArchive = () => {
    Modal.confirm({
      centered: true,
      title: '将会更新全站的所有全量数据缓存，确定要继续吗？',
      onOk: () => archiveLoading.promise(updateArchiveCache())
    })
  }

  return (
    <Row>
      <Button
        type="primary"
        block={true}
        loading={databaseLoading.state.value}
        onClick={handleUpdateDatabaseBackup}
        icon={<Icon.CloudUploadOutlined />}
      >
        立即更新数据库备份
      </Button>
      <Divider />
      <Button
        type="primary"
        block={true}
        loading={archiveLoading.state.value}
        onClick={handleUpdateArchive}
        icon={<Icon.CloudSyncOutlined />}
      >
        更新 Archive 及缓存
      </Button>
    </Row>
  )
}
