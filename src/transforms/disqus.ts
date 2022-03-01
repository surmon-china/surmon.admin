/**
 * @file Disqus
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue } from '@/constants/general'
import { getKeyValue } from './key-value'

export const getDisqusUserName = (kvs: GeneralKeyValue[]) => {
  return getKeyValue(kvs, 'disqus-author-username')
}

export const getDisqusAnonymous = (kvs: GeneralKeyValue[]) => {
  return getKeyValue(kvs, 'disqus-anonymous') === 'true'
}
