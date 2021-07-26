/**
 * @file 链接转换
 * @author Surmon <https://github.com/surmon-china>
 */

import { BLOG_HOST } from '@/config'

export const getFEArticleUrl = (articleId: number) => {
  return `${BLOG_HOST}/article/${articleId}`
}

export const getFETagPath = (tagSlug: string) => {
  return `${BLOG_HOST}/tag/${tagSlug}`
}

export const getFECategoryPath = (categorySlug: string) => {
  return `${BLOG_HOST}/category/${categorySlug}`
}

export const getFEGuestbookPath = () => {
  return `${BLOG_HOST}/guestbook`
}
