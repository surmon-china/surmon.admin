import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useRef, onMounted } from '@/veact';

import { RouteKey, rc } from '@/route';
import { Article } from '@/constants/article';
import { useLoading } from '@/services/loading';
import { scrollTo } from '@/services/scroller';
import { getArticle, putArticle, deleteArticles } from '@/store/article';
import { ArticleEditor } from './Editor';

export const ArticleEdit: React.FC = () => {
  const { article_id: articleId } = useParams<{ article_id: string }>();
  const history = useHistory();
  const fetching = useLoading();
  const submitting = useLoading();
  const article = useRef<Article | null>(null);
  const fetchArticle = () => {
    return fetching.promise(getArticle(articleId)).then((result) => {
      article.value = result;
    });
  };

  const fetchUpdateArticle = (_article: Article) => {
    return submitting.promise(putArticle(_article)).then((result) => {
      article.value = result;
      scrollTo(document.body);
    });
  };

  const fetchDeleteArticle = () => {
    return submitting.promise(deleteArticles([article.value?._id!])).then(() => {
      history.push(rc(RouteKey.ArticleList).path);
      scrollTo(document.body);
    });
  };

  onMounted(() => {
    fetchArticle();
  });

  return (
    <ArticleEditor
      title="编辑文章"
      article={article}
      loading={fetching.state.value}
      submitting={submitting.state.value}
      onSubmit={fetchUpdateArticle}
      onDelete={fetchDeleteArticle}
    />
  );
};
