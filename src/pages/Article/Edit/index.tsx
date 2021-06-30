import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Modal, Button, Space, Badge } from 'antd';
import { DeleteOutlined, CommentOutlined, RocketOutlined } from '@ant-design/icons';
import { useRef, onMounted } from '@/veact';
import { RouteKey, rc } from '@/route';
import { Article } from '@/constants/article';
import { SortType } from '@/constants/general-state';
import { useLoading } from '@/services/loading';
import { scrollTo } from '@/services/scroller';
import { getArticle, putArticle, deleteArticles } from '@/store/article';
import { getComments, CommentTree } from '@/store/comment';
import { getFEArticleUrl } from '@/transformers/url';
import { ArticleEditor } from '../Editor';
import { ArticleComment } from './Comment';

export const ArticleEdit: React.FC = () => {
  const { article_id: articleId } = useParams<{ article_id: string }>();
  const history = useHistory();
  const fetching = useLoading();
  const submitting = useLoading();
  const article = useRef<Article | null>(null);
  const fetchArticle = () => {
    return fetching.promise(getArticle(articleId)).then((result) => {
      article.value = result;
      return result;
    });
  };

  // Modal
  const isVisibleCommentModal = useRef<boolean>(false);
  const openCommentModal = () => {
    isVisibleCommentModal.value = true;
  };
  const closeCommentModal = () => {
    isVisibleCommentModal.value = false;
  };

  // Comment
  const commentLoading = useLoading();
  const comments = useRef<Array<CommentTree>>([]);
  const fetchComments = (articleId: number) => {
    commentLoading
      .promise(getComments({ per_page: 999, sort: SortType.Asc, post_id: articleId }))
      .then((result) => {
        comments.value = result.tree;
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

  const handleManageComment = () => {
    history.push({
      pathname: rc(RouteKey.Comment).path,
      search: `post_id=${article.value?.id!}`,
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: `你确定要彻底删除文章 《${article!.value!.title}》 吗？`,
      content: '该行为是物理删除，不可恢复！',
      onOk: fetchDeleteArticle,
      okButtonProps: {
        danger: true,
        type: 'ghost',
      },
    });
  };

  onMounted(() => {
    fetchArticle().then((_article) => {
      fetchComments(_article.id!);
    });
  });

  return (
    <>
      <ArticleEditor
        title="编辑文章"
        extra={
          <Space>
            <Button
              type="dashed"
              size="small"
              danger={true}
              icon={<DeleteOutlined />}
              disabled={fetching.state.value}
              onDoubleClick={handleDelete}
            >
              删除文章
            </Button>
            <Badge count={article.value?.meta?.comments}>
              <Button
                type="ghost"
                size="small"
                icon={<CommentOutlined />}
                disabled={fetching.state.value}
                onClick={openCommentModal}
              >
                文章评论
              </Button>
            </Badge>
            <Button
              size="small"
              type="primary"
              icon={<RocketOutlined />}
              target="_blank"
              href={getFEArticleUrl(article.value?.id!)}
            />
          </Space>
        }
        article={article}
        loading={fetching.state.value}
        submitting={submitting.state.value}
        onSubmit={fetchUpdateArticle}
      />
      <ArticleComment
        visible={isVisibleCommentModal.value}
        loading={commentLoading.state.value}
        comments={comments.value}
        onClose={closeCommentModal}
        onManage={handleManageComment}
        onRefresh={() => fetchComments(article.value?.id!)}
      />
    </>
  );
};
