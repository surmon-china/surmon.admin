/**
 * @file Comment
 * @author Surmon <https://github.com/surmon-china>
 */

import { arrayToTree } from 'performant-array-to-tree'
import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/request'
import { Comment, CommentState } from '@/constants/comment'
import { SortTypeWithHot } from '@/constants/sort'
import nodepress from '@/services/nodepress'

export const COMMENT_API_PATH = '/comment'

export interface CommentTree extends Comment {
  children?: Array<CommentTree>
}

/** 获取评论参数 */
export interface GetCommentsParams extends GeneralPaginateQueryParams {
  keyword?: string
  post_id?: number
  state?: CommentState
  sort?: SortTypeWithHot
}

/** 获取评论列表 */
export function getComments(params: GetCommentsParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Comment>>(COMMENT_API_PATH, { params })
    .then((response) => ({
      ...response.result,
      tree: arrayToTree(response.result.data, {
        id: 'id',
        parentId: 'pid',
        childrenField: 'children',
        dataField: null,
        rootParentIds: {
          0: true
        }
      }) as Array<CommentTree>
    }))
}

/** 获取评论详情 */
export function getComment(commentID: string) {
  return nodepress
    .get<Comment>(`${COMMENT_API_PATH}/${commentID}`)
    .then((response) => response.result)
}

/** 更新评论 */
export function putComment(comment: Comment): Promise<any> {
  return nodepress
    .put<Comment>(`${COMMENT_API_PATH}/${comment._id}`, comment)
    .then((response) => response.result)
}

/** 更新评论状态 */
export function updateCommentsState(
  commentIds: Array<string>,
  postIds: Array<number>,
  state: CommentState
) {
  return nodepress
    .patch(COMMENT_API_PATH, {
      comment_ids: commentIds,
      post_ids: postIds,
      state
    })
    .then((response) => response.result)
}

/** 批量删除评论 */
export function deleteComments(commentIds: Array<string>, postIds: Array<number>) {
  return nodepress
    .delete(COMMENT_API_PATH, { data: { comment_ids: commentIds, post_ids: postIds } })
    .then((response) => response.result)
}

export function reviseCommentIPLocation(commentID: string) {
  return nodepress
    .put(`${COMMENT_API_PATH}/${commentID}/ip_location`)
    .then((response) => response.result)
}
