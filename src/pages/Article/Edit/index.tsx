/**
 * @file Article edit page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Modal, Button, Space, Divider, message } from 'antd'
import * as Icons from '@ant-design/icons'
import { RoutesKey, RoutesPath, RoutesPather } from '@/routes'
import { getUnEditorCache } from '@/components/common/UniversalEditor'
import { SortTypeWithHot } from '@/constants/sort'
import { Article } from '@/constants/article'
import { scrollTo } from '@/services/scroller'
import { getArticle, updateArticle, deleteArticles } from '@/apis/article'
import { getComments, CommentTree } from '@/apis/comment'
import { numberToKilo } from '@/transforms/number'
import { getBlogArticleUrl } from '@/transforms/url'
import { ArticleEditor } from '../Editor'
import { ArticleComments } from './Comments'

export const ArticleEditPage: React.FC = () => {
  const { article_id: articleId } = useParams<'article_id'>()
  const navigate = useNavigate()
  const fetching = useLoading()
  const submitting = useLoading()
  const article = useRef<Article | null>(null)
  const articleCacheId = React.useMemo(() => {
    return RoutesPather.articleDetail(articleId!)
  }, [articleId])

  // modal
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
  const comments = useRef<CommentTree[]>([])
  const fetchComments = (articleId: number) => {
    commentLoading
      .promise(getComments({ per_page: 50, sort: SortTypeWithHot.Asc, post_id: articleId }))
      .then((result) => {
        commentCount.value = result.pagination?.total!
        comments.value = result.tree
      })
  }

  const fetchUpdateArticle = (_article: Article) => {
    return submitting.promise(updateArticle(_article)).then((result) => {
      article.value = result
      scrollTo(document.body)
    })
  }

  const fetchDeleteArticle = () => {
    return submitting.promise(deleteArticles([article.value?._id!])).then(() => {
      navigate(RoutesPath[RoutesKey.ArticleList])
      scrollTo(document.body)
    })
  }

  const handleDelete = () => {
    Modal.confirm({
      title: `你确定要彻底删除文章《${article!.value!.title}》吗？`,
      content: '该行为是物理删除，不可恢复！',
      onOk: fetchDeleteArticle,
      okButtonProps: {
        danger: true,
        ghost: true
      }
    })
  }

  const navigateToCommentList = () => {
    navigate({
      pathname: RoutesPath[RoutesKey.Comment],
      search: `post_id=${article.value?.id!}`
    })
  }

  onMounted(async () => {
    try {
      const remote = await fetching.promise(getArticle(articleId!))
      fetchComments(remote.id!)
      const localContent = getUnEditorCache(articleCacheId)
      if (!!localContent && localContent !== remote.content) {
        Modal.confirm({
          title: '本地缓存存在未保存的文章，是否要覆盖远程数据？',
          content: '如果覆盖错了，就自己刷新吧！',
          okText: '本地覆盖远程',
          cancelText: '使用远程数据',
          centered: true,
          okButtonProps: {
            danger: true
          },
          onOk() {
            article.value = { ...remote, content: localContent || '' }
          },
          onCancel() {
            article.value = remote
          }
        })
      } else {
        article.value = remote
      }
    } catch (error: any) {
      Modal.error({
        centered: true,
        title: '文章请求失败',
        content: String(error.message)
      })
    }
  })

  return (
    <>
      <ArticleEditor
        article={article}
        editorCacheID={articleCacheId}
        loading={fetching.state.value}
        submitting={submitting.state.value}
        onSubmit={fetchUpdateArticle}
        extra={
          <Space size="small" wrap>
            <Button.Group size="small">
              <Button icon={<Icons.EyeOutlined />} disabled>
                {numberToKilo(article.value?.meta?.views ?? 0)} 阅读
              </Button>
              <Button icon={<Icons.HeartOutlined />} disabled>
                {numberToKilo(article.value?.meta?.likes ?? 0)} 喜欢
              </Button>
              <Button
                icon={<Icons.CommentOutlined />}
                disabled={fetching.state.value}
                onClick={openCommentModal}
              >
                {numberToKilo(commentCount.value)} 评论
              </Button>
            </Button.Group>
            <Divider type="vertical" />
            <Button
              size="small"
              type="dashed"
              icon={<Icons.ExportOutlined />}
              target="_blank"
              href={getBlogArticleUrl(article.value?.id!)}
            >
              打开
            </Button>
            <Divider type="vertical" />
            <Button
              type="dashed"
              size="small"
              danger={true}
              icon={<Icons.DeleteOutlined />}
              disabled={fetching.state.value}
              onClick={() => message.warning('双击执行删除操作')}
              onDoubleClick={handleDelete}
            >
              删除文章
            </Button>
          </Space>
        }
      />
      <ArticleComments
        visible={isVisibleCommentModal.value}
        loading={commentLoading.state.value}
        count={commentCount.value}
        comments={comments.value}
        onClose={closeCommentModal}
        onNavigate={navigateToCommentList}
        onRefresh={() => fetchComments(article.value?.id!)}
      />
    </>
  )
}
