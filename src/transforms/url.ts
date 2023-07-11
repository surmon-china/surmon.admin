/**
 * @file 链接转换
 * @author Surmon <https://github.com/surmon-china>
 */

import { COMMENT_GUESTBOOK_POST_ID } from '@/constants/comment'
import { BLOG_URL, BASE_PATH } from '@/config'

export const getResourceUrl = (uri: string) => {
  const path = BASE_PATH.endsWith('/') ? BASE_PATH : `${BASE_PATH}/`
  return uri.startsWith('/') ? path + uri.substring(1, uri.length) : path + uri
}

export const BLOG_ARTICLE_URL_PREFIX = `${BLOG_URL}/article/`
export const getBlogArticleUrl = (articleID: number) => {
  return `${BLOG_ARTICLE_URL_PREFIX}${articleID}`
}

export const getBlogTagUrl = (tagSlug: string) => {
  return `${BLOG_URL}/tag/${tagSlug}`
}

export const getBlogCategoryUrl = (categorySlug: string) => {
  return `${BLOG_URL}/category/${categorySlug}`
}

export const getBlogGuestbookUrl = () => {
  return `${BLOG_URL}/guestbook`
}

export const getBlogURLByPostID = (postID: number) => {
  return postID === COMMENT_GUESTBOOK_POST_ID ? getBlogGuestbookUrl() : getBlogArticleUrl(postID)
}
