import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoading } from 'veact-use'
import { RouteKey, rc } from '@/routes'
import { Article } from '@/constants/article'
import { scrollTo } from '@/services/scroller'
import { createArticle } from '@/store/article'
import { ArticleEditor } from './Editor'

export const ArticleCreate: React.FC = () => {
  const navigate = useNavigate()
  const submitting = useLoading()
  const fetchCreateArticle = (article: Article) => {
    return submitting.promise(createArticle(article)).then((result) => {
      navigate(rc(RouteKey.ArticleEdit).pather!(result._id!))
      scrollTo(document.body)
    })
  }

  return (
    <ArticleEditor
      title="新撰文章"
      loading={false}
      submitting={submitting.state.value}
      onSubmit={fetchCreateArticle}
    />
  )
}
