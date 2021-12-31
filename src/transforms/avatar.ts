/**
 * @file Avatar 地址获取器
 * @author Surmon <https://github.com/surmon-china>
 */

import { Comment } from '@/constants/comment'
import { GRAVATAR_API, isDev } from '@/config'

export const getGravatar = (emailhash: string) => {
  // https://en.gravatar.com/site/implement/images/
  return isDev
    ? `https://www.gravatar.com/avatar/${emailhash}`
    : `${GRAVATAR_API}/${emailhash}`
}

export const getDisqusAvatar = (username: string) => {
  // https://disqus.com/api/docs/images/
  return `https://disqus.com/api/users/avatars/${username}.jpg`
}

export const autoCommentAvatar = (comment: Comment) => {
  if (comment.author.email_hash) {
    return getGravatar(comment.author.email_hash)
  }

  const disqusUsername = comment.extends?.find(
    (e) => e.name === 'disqus-author-username'
  )?.value
  if (disqusUsername) {
    return getDisqusAvatar(disqusUsername)
  }

  return ''
}
