/**
 * @desc Global admin state
 * @author Surmon <https://github.com/surmon-china>
 */

import { ref, reactive, readonly, useReactivity } from 'veact'
import { createLoading } from 'veact-use'
import { AvatarType, Auth } from '@/constants/auth'
import { getAdminInfo } from '@/store/auth'
import { getResourceUrl } from '@/transforms/url'

const DEFAULT_ADMIN_INFO: Auth = Object.freeze({
  name: 'Admin',
  slogan: 'NodePress',
  email: '',
  avatar_type: AvatarType.URL,
  avatar: getResourceUrl('/images/profile/logo-smooth.png'),
})

const data = reactive({ ...DEFAULT_ADMIN_INFO })
const loading = createLoading(false, ref)
const fetch = () => {
  return loading.promise(getAdminInfo()).then((result) => {
    if (result) {
      data.name = result.name
      data.slogan = result.slogan
      data.email = result.email
      data.avatar_type = result.avatar_type
      data.avatar = result.avatar
    }
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
