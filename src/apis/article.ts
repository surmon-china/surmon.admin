/**
 * @file Article
 * @author Surmon <https://github.com/surmon-china>
 */

import { PublishState } from '@/constants/publish'
import { SortTypeWithHot } from '@/constants/sort'
import { ArticleId, Article } from '@/constants/article'
import { ArticleOrigin } from '@/constants/article/origin'
import { ArticlePublic } from '@/constants/article/public'
import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/request'
import nodepress from '@/services/nodepress'

export const ARTICLE_API_PATH = '/article'

/** 获取文章参数 */
export interface GetArticleParams extends GeneralPaginateQueryParams {
  sort?: SortTypeWithHot
  state?: PublishState
  public?: ArticlePublic
  origin?: ArticleOrigin
  keyword?: string
  tag_slug?: string
  category_slug?: string
}

/** 获取文章列表 */
export function getArticles(params: GetArticleParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Article>>(ARTICLE_API_PATH, { params })
    .then((response) => response.result)
}

/** 获取文章详情 */
export function getArticle(articleID: ArticleId) {
  return nodepress
    .get<Article>(`${ARTICLE_API_PATH}/${articleID}`)
    .then((response) => response.result)
}

/** 创建文章 */
export function createArticle(article: Article) {
  return nodepress.post<Article>(ARTICLE_API_PATH, article).then((response) => response.result)
}

/** 修改文章 */
export function putArticle(article: Article) {
  return nodepress
    .put<Article>(`${ARTICLE_API_PATH}/${article._id}`, article)
    .then((response) => response.result)
}

/** 批量修改文章状态 */
export function patchArticlesState(articleIds: ArticleId[], state: PublishState) {
  return nodepress
    .patch(ARTICLE_API_PATH, { article_ids: articleIds, state })
    .then((response) => response.result)
}

/** 批量删除文章 */
export function deleteArticles(articleIds: ArticleId[]) {
  return nodepress
    .delete(ARTICLE_API_PATH, { data: { article_ids: articleIds } })
    .then((response) => response.result)
}
