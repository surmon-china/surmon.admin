/**
 * @file Article store
 * @module store.article
 * @author Surmon <https://github.com/surmon-china>
 */

import http from '@/services/http';
import { PublishState } from '@/constants/publish-state';
import { SortType } from '@/constants/general-state';
import { ArticleId, Article } from '@/constants/article';
import { ArticleOrigin } from '@/constants/article/origin';
import { ArticlePublic } from '@/constants/article/public';
import { ResponsePaginationData, GeneralGetPageParams } from '@/constants/request';

export const ARTICLE_API_PATH = '/article';

/** 获取文章参数 */
export interface GetArticleParams extends GeneralGetPageParams {
  keyword?: string;
  tag?: string;
  category?: string;
  sort?: SortType;
  state?: PublishState;
  public?: ArticlePublic;
  origin?: ArticleOrigin;
}
/** 获取文章列表 */
export function getArticles(params: GetArticleParams = {}) {
  return http
    .get<ResponsePaginationData<Article>>(ARTICLE_API_PATH, {
      params,
    })
    .then((response) => response.result);
}

/** 获取文章详情 */
export function getArticle(articleId: ArticleId) {
  return http
    .get<Article>(`${ARTICLE_API_PATH}/${articleId}`)
    .then((response) => response.result);
}

/** 创建文章 */
export function createArticle(article: Article) {
  return http
    .post<Article>(ARTICLE_API_PATH, article)
    .then((response) => response.result);
}

/** 修改文章 */
export function putArticle(article: Article) {
  return http
    .put<Article>(`${ARTICLE_API_PATH}/${article.id}`, article)
    .then((response) => response.result);
}

/** 批量修改文章状态 */
export function patchArticlesState(articleIds: ArticleId[], state: PublishState) {
  return http
    .patch(ARTICLE_API_PATH, { article_ids: articleIds, state })
    .then((response) => response.result);
}

/** 批量删除文章 */
export function deleteArticles(articleIds: ArticleId[]) {
  return http
    .delete(ARTICLE_API_PATH, { data: { article_ids: articleIds } })
    .then((response) => response.result);
}
