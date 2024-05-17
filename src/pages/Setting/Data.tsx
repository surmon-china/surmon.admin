import React from 'react'
import { useLoadings } from 'veact-use'
import { Button, Row, Divider, Modal } from 'antd'
import * as Icon from '@ant-design/icons'

import { updateDatabaseBackup, updateArchiveCache } from '@/apis/system'

enum LoadingKey {
  Databse = 'databse',
  Archive = 'archive'
}

export const DataForm: React.FC = () => {
  const loading = useLoadings(LoadingKey.Databse, LoadingKey.Archive)

  const handleUpdateDatabaseBackup = () => {
    Modal.confirm({
      centered: true,
      title: '更新备份会导致强制覆盖旧的数据库备份，确定要继续吗？',
      onOk: () => loading.promise(LoadingKey.Databse, updateDatabaseBackup())
    })
  }

  const handleUpdateArchive = () => {
    Modal.confirm({
      centered: true,
      title: '将会更新全站的所有全量数据缓存，确定要继续吗？',
      onOk: () => loading.promise(LoadingKey.Archive, updateArchiveCache())
    })
  }

  return (
    <Row>
      <Button
        icon={<Icon.CloudUploadOutlined />}
        type="primary"
        block={true}
        loading={loading.isLoading(LoadingKey.Databse)}
        onClick={handleUpdateDatabaseBackup}
      >
        立即更新数据库备份
      </Button>
      <Divider />
      <Button
        icon={<Icon.CloudSyncOutlined />}
        type="primary"
        block={true}
        loading={loading.isLoading(LoadingKey.Archive)}
        onClick={handleUpdateArchive}
      >
        更新 Archive 及缓存
      </Button>
    </Row>
  )
}
