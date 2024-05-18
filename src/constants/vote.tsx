/**
 * @file Vote constant
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icon from '@ant-design/icons'
import { IPLocation } from './general'

export interface Vote {
  _id: string
  id: number
  target_type: VoteTarget
  target_id: number
  vote_type: VoteType
  author_type: VoteAuthorType
  author: Record<string, any> | null
  ip: string | null
  ip_location: Partial<IPLocation> | null
  user_agent?: string | null
  created_at?: string
  updated_at?: string
}

export enum VoteType {
  Upvote = 1,
  Downvote = -1
}

export enum VoteTarget {
  Post = 1,
  Comment = 2
}

export enum VoteAuthorType {
  Anonymous = 0,
  Guest = 1,
  Disqus = 2
}

const voteTargetTextMap = new Map([
  [VoteTarget.Post, '页面'],
  [VoteTarget.Comment, '评论']
])

export const getVoteTargetText = (voteTarget: VoteTarget) => {
  return voteTargetTextMap.get(voteTarget)!
}

const voteAuthorTypeMap = new Map([
  [VoteAuthorType.Anonymous, '匿名用户'],
  [VoteAuthorType.Guest, '本地访客'],
  [VoteAuthorType.Disqus, 'Disqus 用户']
])

export const getVoteAuthorTypeText = (voteAuthorType: VoteAuthorType) => {
  return voteAuthorTypeMap.get(voteAuthorType)!
}

export const voteTypes = [
  {
    id: VoteType.Upvote,
    name: '+1',
    icon: <Icon.LikeOutlined />
  },
  {
    id: VoteType.Downvote,
    name: '-1',
    icon: <Icon.DislikeOutlined />
  }
]

const voteTypeMap = new Map(voteTypes.map((item) => [item.id, item]))

export const getVoteType = (voteType: VoteType) => {
  return voteTypeMap.get(voteType)!
}
