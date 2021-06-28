import React from 'react';
import { Table, Button, Card, Input, Divider, Spin, Modal, Space } from 'antd';
import {
  useShallowReactive,
  useRef,
  onMounted,
  useReactive,
  useComputed,
} from '@/veact';

import { ArticleEditor } from './Editor';

export const ArticleCreate: React.FC = () => {
  return (
    <ArticleEditor
      title="新撰文章"
      loading={false}
      article={null}
      onSubmit={(article) => {
        console.log('提交新文章', article);
      }}
    />
  );
};
