import React from 'react'
import { useLoading } from 'veact-use'
import { Button, Row, Divider, Modal } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/system'

export const ActionsForm: React.FC = () => {
  const databaseUpdating = useLoading()
  const archiveUpdating = useLoading()

  const updateDatabaseBackup = () => {
    Modal.confirm({
      centered: true,
      title: '更新备份会导致强制覆盖旧的数据库备份，确定要继续吗？',
      onOk: () => databaseUpdating.promise(api.updateDatabaseBackup())
    })
  }

  const updateArchiveCache = () => {
    Modal.confirm({
      centered: true,
      title: '将会更新全站的所有全量数据缓存，确定要继续吗？',
      onOk: () => archiveUpdating.promise(api.updateArchiveCache())
    })
  }

  return (
    <Row>
      <Button
        type="primary"
        block={true}
        loading={databaseUpdating.state.value}
        onClick={updateDatabaseBackup}
        icon={<Icons.CloudUploadOutlined />}
      >
        立即更新数据库备份
      </Button>
      <Divider />
      <Button
        type="primary"
        block={true}
        loading={archiveUpdating.state.value}
        onClick={updateArchiveCache}
        icon={<Icons.CloudSyncOutlined />}
      >
        更新 Archive 及缓存
      </Button>
    </Row>
  )
}
