import React from 'react';
import { Button, Row, Col, Divider, Modal } from 'antd';
import {
  CloudUploadOutlined,
  CloudDownloadOutlined,
  SyncOutlined,
} from '@ant-design/icons';

import { useLoadings } from '@/services/loading';
import { updateDatabaseBackup, updateSyndicationCache } from '@/store/system';

export interface DataFormProps {
  labelSpan: number;
  wrapperSpan: number;
}

enum LoadingKey {
  Databse = 'databse',
  Syndication = 'syndication',
}

export const DataForm: React.FC<DataFormProps> = (props) => {
  const loading = useLoadings(LoadingKey.Databse, LoadingKey.Syndication);
  const updateDatebaseBackup = () => {
    return loading.promise(LoadingKey.Databse, updateDatabaseBackup()).then();
  };

  const updateSyndication = () => {
    return loading.promise(LoadingKey.Syndication, updateSyndicationCache()).then();
  };

  const handleUpdateDatabaseBackup = () => {
    Modal.confirm({
      centered: true,
      title: '更新备份会导致强制覆盖旧的数据库备份，确定要继续吗？',
      onOk: updateDatebaseBackup,
    });
  };

  const handleUpdateSyndication = () => {
    Modal.confirm({
      centered: true,
      title: '将会更新 Sitemap 以及 SSR 所需而生成的 XML 文件，确定要继续吗？',
      onOk: updateSyndication,
    });
  };

  return (
    <Row>
      <Col span={props.wrapperSpan} offset={props.labelSpan}>
        <Button.Group>
          <Button
            icon={<CloudUploadOutlined />}
            type="primary"
            loading={loading.isLoading(LoadingKey.Databse)}
            onClick={handleUpdateDatabaseBackup}
          >
            立即更新数据库备份
          </Button>
          <Button icon={<CloudDownloadOutlined />} type="primary" disabled={true}>
            从备份文件恢复数据库（暂不支持）
          </Button>
        </Button.Group>
        <Divider />
        <Button
          icon={<SyncOutlined />}
          type="primary"
          loading={loading.isLoading(LoadingKey.Syndication)}
          onClick={handleUpdateSyndication}
        >
          更新 SiteMap & RSS
        </Button>
      </Col>
    </Row>
  );
};
