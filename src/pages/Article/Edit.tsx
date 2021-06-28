import React from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Card, Input, Divider, Spin, Modal, Space } from 'antd';
import {
  useShallowReactive,
  useRef,
  onMounted,
  useReactive,
  useComputed,
} from '@/veact';

import { Article } from '@/constants/article';
import { useLoading } from '@/services/loading';
import { getArticle, putArticle } from '@/store/article';
import { ArticleEditor } from './Editor';

export const ArticleEdit: React.FC = () => {
  const { article_id: articleId } = useParams<{ article_id: string }>();
  const fetching = useLoading();
  const article = useRef<Article | null>(null);
  const fetchArticle = () => {
    return fetching.promise(getArticle(articleId)).then((result) => {
      article.value = result;
    });
  };

  const fetchUpdateArticle = (_article: Article) => {
    console.log('更新文章', article);
    return fetching.promise(putArticle(_article)).then((result) => {
      article.value = result;
    });
  };

  onMounted(() => {
    fetchArticle();
  });

  return (
    <ArticleEditor
      title="编辑文章"
      article={article.value}
      loading={fetching.state.value}
      onSubmit={fetchUpdateArticle}
    />
  );
};
