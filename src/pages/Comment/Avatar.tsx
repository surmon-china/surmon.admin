import React from 'react'
import { Avatar, AvatarProps, Badge, Popover } from 'antd'
import { Comment } from '@/constants/comment'
import { autoCommentAvatar } from '@/transforms/avatar'
import { getDisqusAnonymous } from '@/transforms/disqus'

export interface CommentAvatarProps {
  comment: Comment
  size?: AvatarProps['size']
}

export const CommentAvatar: React.FC<CommentAvatarProps> = (props) => {
  const isDisqusAnonymous = getDisqusAnonymous(props.comment.extends)
  const color = isDisqusAnonymous ? '#90c53f' : '#2e9fff'
  const title = isDisqusAnonymous ? 'Guest user' : 'Disqus user'
  return (
    <Popover placement="right" content={title}>
      <Badge count={isDisqusAnonymous ? 'G' : 'D'} title={title} color={color}>
        <Avatar shape="square" size={props.size} src={autoCommentAvatar(props.comment)} />
      </Badge>
    </Popover>
  )
}
