import React from 'react'
import { Avatar, AvatarProps, Badge, Popover } from 'antd'
import { Comment } from '@/constants/comment'
import { autoCommentAvatar } from '@/transforms/avatar'
import { getDisqusAnonymous } from '@/transforms/disqus'

import styles from './avatar.module.less'

export interface CommentAvatarProps {
  comment: Comment
  size?: AvatarProps['size']
}

export const CommentAvatar: React.FC<CommentAvatarProps> = (props) => {
  const isDisqusAnonymous = getDisqusAnonymous(props.comment.extends)
  const title = isDisqusAnonymous ? 'Guest user' : 'Disqus user'
  const iconUrl = isDisqusAnonymous ? '/images/logo.mini.svg' : '/images/disqus.svg'
  return (
    <Badge
      className={styles.avatarBadge}
      title={title}
      count={
        <Popover placement="right" content={title}>
          <span className={styles.avatarBadgeIconWrapper}>
            <img className={styles.avatarBadgeIcon} src={iconUrl} />
          </span>
        </Popover>
      }
    >
      <Avatar shape="square" size={props.size} src={autoCommentAvatar(props.comment)} />
    </Badge>
  )
}
