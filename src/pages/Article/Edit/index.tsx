/**
 * @file Article edit page
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useMemo } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Modal, Button, Space, Badge } from 'antd'
import {
  DeleteOutlined,
  CommentOutlined,
  RocketOutlined,
  HeartOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { RouteKey, rc } from '@/route'
import { getUEditorCache } from '@/components/common/UniversalEditor'
import { Article } from '@/constants/article'
import { SortType } from '@/constants/sort'
import { scrollTo } from '@/services/scroller'
import { getArticle, putArticle, deleteArticles } from '@/store/article'
import { getComments, CommentTree } from '@/store/comment'
import { getBlogArticleUrl } from '@/transformers/url'
import { ArticleEditor } from '../Editor'
import { ArticleComment } from './Comment'

export const ArticleEdit: React.FC = () => {
  const { article_id: articleId } = useParams<{ article_id: string }>()
  const history = useHistory()
  const fetching = useLoading()
  const submitting = useLoading()
  const article = useRef<Article | null>(null)
  const articleCacheID = useMemo(
    () => rc(RouteKey.ArticleEdit).getter!(articleId),
    [articleId]
  )

  // Modal
  const isVisibleCommentModal = useRef<boolean>(false)
  const openCommentModal = () => {
    isVisibleCommentModal.value = true
  }
  const closeCommentModal = () => {
    isVisibleCommentModal.value = false
  }

  // Comment
  const commentLoading = useLoading()
  const commentCount = useRef<number>(0)
  const comments = useRef<Array<CommentTree>>([])
  const fetchComments = (articleId: number) => {
    commentLoading
      .promise(getComments({ per_page: 999, sort: SortType.Asc, post_id: articleId }))
      .then((result) => {
        commentCount.value = result.pagination?.total!
        comments.value = result.tree
      })
  }

  const fetchUpdateArticle = (_article: Article) => {
    return submitting.promise(putArticle(_article)).then((result) => {
      article.value = result
      scrollTo(document.body)
    })
  }

  const fetchDeleteArticle = () => {
    return submitting.promise(deleteArticles([article.value?._id!])).then(() => {
      history.push(rc(RouteKey.ArticleList).path)
      scrollTo(document.body)
    })
  }

  const handleManageComment = () => {
    history.push({
      pathname: rc(RouteKey.Comment).path,
      search: `post_id=${article.value?.id!}`,
    })
  }

  const handleDelete = () => {
    Modal.confirm({
      title: `你确定要彻底删除文章 《${article!.value!.title}》 吗？`,
      content: '该行为是物理删除，不可恢复！',
      onOk: fetchDeleteArticle,
      okButtonProps: {
        danger: true,
        type: 'ghost',
      },
    })
  }

  onMounted(() => {
    fetching.promise(getArticle(articleId)).then((_article) => {
      fetchComments(_article.id!)
      const localContent = getUEditorCache(articleCacheID)
      if (Boolean(localContent) && localContent !== _article.content) {
        Modal.confirm({
          title: '本地缓存存在未保存的文章，是否要覆盖远程数据？',
          content: '如果覆盖错了，就自己刷新吧！',
          okText: '本地覆盖远程',
          cancelText: '使用远程数据',
          centered: true,
          okButtonProps: {
            danger: true,
          },
          onOk() {
            article.value = { ..._article, content: localContent || '' }
          },
          onCancel() {
            article.value = _article
          },
        })
      } else {
        article.value = _article
      }
    })
  })

  return (
    <>
      <ArticleEditor
        title="编辑文章"
        article={article}
        editorCacheID={articleCacheID}
        loading={fetching.state.value}
        submitting={submitting.state.value}
        onSubmit={fetchUpdateArticle}
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
            <Badge count={commentCount.value}>
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
            <Button.Group>
              <Button size="small" icon={<HeartOutlined />} disabled={true}>
                {article.value?.meta?.likes} 喜欢
              </Button>
              <Button size="small" icon={<EyeOutlined />} disabled={true}>
                {article.value?.meta?.views} 阅读
              </Button>
              <Button
                size="small"
                icon={<RocketOutlined />}
                target="_blank"
                href={getBlogArticleUrl(article.value?.id!)}
              />
            </Button.Group>
          </Space>
        }
      />
      <ArticleComment
        visible={isVisibleCommentModal.value}
        loading={commentLoading.state.value}
        count={commentCount.value}
        comments={comments.value}
        onClose={closeCommentModal}
        onManage={handleManageComment}
        onRefresh={() => fetchComments(article.value?.id!)}
      />
    </>
  )
}
