import React from 'react';

import {
  useShallowReactive,
  useRef,
  onMounted,
  useReactive,
  useComputed,
} from '@/veact';
import { Table, Button, Card, Row, Col, Spin, Modal, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { Article } from '@/constants/article';

import styles from './style.module.less';

export interface ArticleEditorProps {
  title: string;
  loading: boolean;
  article: Article | null;
  onDelete?(): any;
  onSubmit(article: Article): any;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = (props) => {
  const handleDelete = () => {
    Modal.confirm({
      title: `你确定要彻底删除文章 《${props.article?.title}》 吗？`,
      content: '该行为是物理删除，不可恢复！',
      onOk: props.onDelete,
      okButtonProps: {
        danger: true,
        type: 'ghost',
      },
    });
  };

  return (
    <div className={styles.articleeEitor}>
      <Row gutter={16}>
        <Col span={16}>
          <Card
            title={props.title}
            bordered={false}
            className={styles.articleeEitor}
            extra={
              <Button
                type="dashed"
                size="small"
                danger={true}
                icon={<DeleteOutlined />}
                disabled={!props.article}
                onClick={handleDelete}
              >
                删除文章
              </Button>
            }
          >
            <span>dasdsaad {props.loading}</span>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card title" bordered={false}>
            Card content
          </Card>
        </Col>
      </Row>
    </div>
  );
};
