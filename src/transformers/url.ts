/**
 * @file 链接转换
 * @author Surmon <https://github.com/surmon-china>
 */

import { BLOG_HOST, BASE_PATH } from '@/config'

export const getResourceUrl = (uri: string) => {
  const path = BASE_PATH.endsWith('/') ? BASE_PATH : `${BASE_PATH}/`
  return uri.startsWith('/') ? path + uri.substr(1, uri.length) : path + uri
}

export const getBlogArticleUrl = (articleId: number) => {
  return `${BLOG_HOST}/article/${articleId}`
}

export const getBlogTagPath = (tagSlug: string) => {
  return `${BLOG_HOST}/tag/${tagSlug}`
}

export const getBlogCategoryPath = (categorySlug: string) => {
  return `${BLOG_HOST}/category/${categorySlug}`
}

export const getBlogGuestbookPath = () => {
  return `${BLOG_HOST}/guestbook`
}
