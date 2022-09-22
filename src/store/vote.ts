/**
 * @file Vote store
 * @author Surmon <https://github.com/surmon-china>
 */

import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/request'
import { Vote, VoteTarget, VoteType, VoteAuthorType } from '@/constants/vote'
import { SortTypeBase } from '@/constants/sort'
import nodepress from '@/services/nodepress'

export const VOTE_API_PATH = '/vote'

export interface GetVotesParams extends GeneralPaginateQueryParams {
  target_type?: VoteTarget
  target_id?: number
  vote_type?: VoteType
  author_type?: VoteAuthorType
  sort?: SortTypeBase
}

export function getVotes(params: GetVotesParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Vote>>(VOTE_API_PATH, { params })
    .then((response) => response.result)
}

export function deleteVotes(voteIds: Array<string>) {
  return nodepress
    .delete(VOTE_API_PATH, { data: { vote_ids: voteIds } })
    .then((response) => response.result)
}
