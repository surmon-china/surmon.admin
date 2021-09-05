/**
 * @desc Global admin state
 * @author Surmon <https://github.com/surmon-china>
 */

import { ref, reactive, readonly, useReactivity } from 'veact'
import { createLoading } from 'veact-use'
import { getAdminInfo } from '@/store/auth'
import { getResourceUrl } from '@/transformers/url'

const DEFAULT_ADMIN_INFO = Object.freeze({
  name: '管理员',
  slogan: '博客管理后台',
  gravatar: getResourceUrl('/images/profile/logo-smooth.png'),
})

const data = reactive({ ...DEFAULT_ADMIN_INFO })
const loading = createLoading(false, ref)
const fetch = () => {
  return loading.promise(getAdminInfo()).then((result) => {
    data.name = result.name
    data.slogan = result.slogan
    data.gravatar = result.gravatar!
    return result
  })
}

export const adminState = {
  data: readonly(data),
  loading: readonly(loading.state),
  refresh: fetch,
}

export const useAdminState = () => {
  return useReactivity(() => adminState)
}
