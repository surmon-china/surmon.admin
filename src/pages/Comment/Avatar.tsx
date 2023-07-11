import React from 'react'
import { Avatar, AvatarProps, Badge, Popover } from 'antd'
import { Comment } from '@/constants/comment'
import { autoCommentAvatar } from '@/transforms/avatar'
import { getDisqusUserName } from '@/transforms/disqus'
import { getResourceUrl } from '@/transforms/url'

import styles from './avatar.module.less'

export interface CommentAvatarProps {
  comment: Comment
  size?: AvatarProps['size']
}

export const CommentAvatar: React.FC<CommentAvatarProps> = (props) => {
  const isDisqusUser = Boolean(getDisqusUserName(props.comment.extends))
  const title = isDisqusUser ? 'Disqus user' : 'Guest user'
  const iconUrl = isDisqusUser ? '/images/disqus.svg' : '/images/logo.mini.svg'
  return (
    <Badge
      className={styles.avatarBadge}
      title={title}
      count={
        <Popover placement="right" content={title}>
          <span className={styles.avatarBadgeIconWrapper}>
            <img className={styles.avatarBadgeIcon} src={getResourceUrl(iconUrl)} />
          </span>
        </Popover>
      }
    >
      <Avatar shape="square" size={props.size} src={autoCommentAvatar(props.comment)} />
    </Badge>
  )
}
