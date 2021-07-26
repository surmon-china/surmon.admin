import React from 'react'
import { useHistory } from 'react-router-dom'
import { useLoading } from 'veact-use'
import { RouteKey, rc } from '@/route'
import { Article } from '@/constants/article'
import { scrollTo } from '@/services/scroller'
import { createArticle } from '@/store/article'
import { ArticleEditor } from './Editor'

export const ArticleCreate: React.FC = () => {
  const history = useHistory()
  const submitting = useLoading()
  const fetchCreateArticle = (article: Article) => {
    return submitting.promise(createArticle(article)).then((result) => {
      history.push(rc(RouteKey.ArticleEdit).getter!(result._id!))
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
