/**
 * @file Avatar 地址获取器
 * @author Surmon <https://github.com/surmon-china>
 */

import * as gravatar from 'gravatar'
import { Comment } from '@/constants/comment'
import { GRAVATAR_API } from '@/config'

export const getGravatar = (email: string): string => {
  const gravatar_url = gravatar.url(email, { protocol: 'https' })
  return gravatar_url.replace('https://s.gravatar.com/avatar', GRAVATAR_API)
}

export const getDisqusAvatar = (username: string) => {
  // https://disqus.com/api/docs/images/
  return `https://disqus.com/api/users/avatars/${username}.jpg`
}

export const autoCommentAvatar = (comment: Comment) => {
  if (comment.author.email) {
    return getGravatar(comment.author.email)
  }

  const disqusUsername = comment.extends?.find(
    (e) => e.name === 'disqus-author-username'
  )?.value
  if (disqusUsername) {
    return getDisqusAvatar(disqusUsername)
  }

  return ''
}
