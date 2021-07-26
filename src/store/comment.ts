/**
 * @file Comment store
 * @author Surmon <https://github.com/surmon-china>
 */

import { arrayToTree } from 'performant-array-to-tree'
import http from '@/services/http'
import { SortType } from '@/constants/sort'
import { Comment, CommentState } from '@/constants/comment'
import { ResponsePaginationData, GeneralGetPageParams } from '@/constants/request'

export const COMMENT_API_PATH = '/comment'
export interface CommentTree extends Comment {
  children?: Array<CommentTree>
}

/** 获取评论参数 */
export interface GetCommentsParams extends GeneralGetPageParams {
  keyword?: string
  post_id?: number
  state?: CommentState
  sort?: SortType
}
/** 获取评论列表 */
export function getComments(params: GetCommentsParams = {}) {
  return http
    .get<ResponsePaginationData<Comment>>(COMMENT_API_PATH, { params })
    .then((response) => ({
      ...response.result,
      tree: arrayToTree(response.result.data, {
        id: 'id',
        parentId: 'pid',
        childrenField: 'children',
        dataField: null,
        rootParentIds: {
          0: true,
        },
      }) as Array<CommentTree>,
    }))
}

/** 获取评论详情 */
export function getComment(commentId: number) {
  return http
    .get<Comment>(`${COMMENT_API_PATH}/${commentId}`)
    .then((response) => response.result)
}

/** 更新评论 */
export function putComment(comment: Comment): Promise<any> {
  return http
    .put<Comment>(`${COMMENT_API_PATH}/${comment._id}`, comment)
    .then((response) => response.result)
}

/** 更新评论状态 */
export function updateCommentsState(
  commentIds: Array<string>,
  postIds: Array<number>,
  state: CommentState
) {
  return http
    .patch(COMMENT_API_PATH, {
      comment_ids: commentIds,
      post_ids: postIds,
      state,
    })
    .then((response) => response.result)
}

/** 批量删除评论 */
export function deleteComments(commentIds: Array<string>, postIds: Array<number>) {
  return http
    .delete(COMMENT_API_PATH, { data: { comment_ids: commentIds, post_ids: postIds } })
    .then((response) => response.result)
}
