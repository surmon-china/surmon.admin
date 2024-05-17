/**
 * @file Feedback
 * @author Surmon <https://github.com/surmon-china>
 */

import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/request'
import { Feedback } from '@/constants/feedback'
import { SortTypeBase } from '@/constants/sort'
import nodepress from '@/services/nodepress'

export const FEEDBACK_API_PATH = '/feedback'

export interface GetFeedbacksParams extends GeneralPaginateQueryParams {
  keyword?: string
  tid?: number
  marked?: 0 | 1
  sort?: SortTypeBase
}

export function getFeedbacks(params: GetFeedbacksParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Feedback>>(FEEDBACK_API_PATH, { params })
    .then((response) => response.result)
}

export function putFeedback(feedback: Feedback): Promise<any> {
  return nodepress
    .put<Comment>(`${FEEDBACK_API_PATH}/${feedback._id}`, feedback)
    .then((response) => response.result)
}

export function deleteFeedbacks(feedbackIds: Array<string>) {
  return nodepress
    .delete(FEEDBACK_API_PATH, { data: { feedback_ids: feedbackIds } })
    .then((response) => response.result)
}
