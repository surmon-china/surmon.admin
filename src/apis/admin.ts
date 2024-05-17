/**
 * @file Admin profile
 * @author Surmon <https://github.com/surmon-china>
 */

import { Base64 } from 'js-base64'
import { AdminProfile } from '@/constants/admin'
import nodepress from '@/services/nodepress'

export const ADMIN_API_PATH = '/auth/admin'

/** 获取管理员资料 */
export function getAdminProfile() {
  return nodepress.get<AdminProfile>(ADMIN_API_PATH).then((response) => response.result)
}

/** 更新管理员资料（包括平台密码） */
export function putAdminProfile(profile: AdminProfile) {
  return nodepress
    .put<AdminProfile>(ADMIN_API_PATH, {
      ...profile,
      password: profile.password ? Base64.encode(profile.password) : '',
      new_password: profile.new_password ? Base64.encode(profile.new_password) : ''
    })
    .then((response) => response.result)
}
