import React from 'react'
import { useLoadings } from 'veact-use'
import { Button, Row, Col, Divider, Modal } from 'antd'
import * as Icon from '@ant-design/icons'
import { updateDatabaseBackup, updateArchiveCache } from '@/store/system'

export interface DataFormProps {
  labelSpan: number
  wrapperSpan: number
}

enum LoadingKey {
  Databse = 'databse',
  Archive = 'archive',
}

export const DataForm: React.FC<DataFormProps> = (props) => {
  const loading = useLoadings(LoadingKey.Databse, LoadingKey.Archive)

  const handleUpdateDatabaseBackup = () => {
    Modal.confirm({
      centered: true,
      title: '更新备份会导致强制覆盖旧的数据库备份，确定要继续吗？',
      onOk: () => loading.promise(LoadingKey.Databse, updateDatabaseBackup()),
    })
  }

  const handleUpdateArchive = () => {
    Modal.confirm({
      centered: true,
      title: '将会更新全站的所有全量数据缓存，确定要继续吗？',
      onOk: () => loading.promise(LoadingKey.Archive, updateArchiveCache()),
    })
  }

  return (
    <Row>
      <Col span={props.wrapperSpan} offset={props.labelSpan}>
        <Button.Group>
          <Button
            icon={<Icon.CloudUploadOutlined />}
            type="primary"
            loading={loading.isLoading(LoadingKey.Databse)}
            onClick={handleUpdateDatabaseBackup}
          >
            立即更新数据库备份
          </Button>
          <Button icon={<Icon.CloudDownloadOutlined />} type="primary" disabled={true}>
            从备份文件恢复数据库（暂不支持）
          </Button>
        </Button.Group>
        <Divider />
        <Button
          icon={<Icon.SyncOutlined />}
          type="primary"
          loading={loading.isLoading(LoadingKey.Archive)}
          onClick={handleUpdateArchive}
        >
          更新 Archive
        </Button>
      </Col>
    </Row>
  )
}
