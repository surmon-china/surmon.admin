/**
 * @desc Global admin state
 * @author Surmon <https://github.com/surmon-china>
 */

import { ref, reactive, readonly, useReactivity } from 'veact'
import { createLoading } from 'veact-use'
import { Auth } from '@/constants/auth'
import { getAdminInfo } from '@/store/auth'
import { getResourceUrl } from '@/transforms/url'

const DEFAULT_ADMIN_INFO: Auth = Object.freeze({
  name: 'Admin',
  slogan: 'NodePress',
  avatar: getResourceUrl('/images/nodepress.png')
})

const data = reactive({ ...DEFAULT_ADMIN_INFO })
const loading = createLoading(false, ref)
const fetch = () => {
  return loading.promise(getAdminInfo()).then((result) => {
    if (result) {
      Object.keys(result).forEach((key) => {
        // @ts-ignore
        data[key] = result[key]
      })
    }
    return result
  })
}

export const adminState = {
  data: readonly(data),
  loading: readonly(loading.state),
  refresh: fetch
}

export const useAdminState = () => {
  return useReactivity(() => adminState)
}
