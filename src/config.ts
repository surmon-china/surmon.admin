/**
 * @file Global config
 * @author Surmon <https://github.com/surmon-china>
 */

import type { SizeType } from 'antd/lib/config-provider/SizeContext'

export const APP_TITLE = 'Surmon.me'
export const BLOG_HOST = '//surmon.me'
export const BLOG_SITE = `https:${BLOG_HOST}`
export const STATIC_URL = 'https://static.surmon.me'
export const GRAVATAR_API = `${STATIC_URL}/avatar`
export const ALIYUN_OSS_REGION = 'oss-cn-hangzhou'
export const ALIYUN_OSS_BUCKET = 'surmon-static'
export const GITHUB_REPO_NAME = 'veact-admin'
export const GITHUB_REPO_URL = 'https://github.com/surmon-china/veact-admin'

export const APP_AUTH_HEADER_KEY = 'Authorization'
export const APP_SIDER_WIDTH = 180
export const APP_SIDER_COLLAPSED_WIDTH = 80
export const APP_LAYOUT_GUTTER_SIZE = 24
export const APP_LAYOUT_SPACE_SIZE: SizeType = 'large'
export const APP_CONTENT_SPACE_SIZE: SizeType = 'middle'
export const APP_COLOR_PRIMARY = '#177ddc'

export const VITE_ENV = import.meta.env
export const ENV = import.meta.env.MODE
export const BASE_PATH = import.meta.env.BASE_URL as string
export const API_URL = import.meta.env.VITE_API_URL as string
export const ENABLED_AD = Boolean(import.meta.env.VITE_ENABLE_AD)
export const ENABLEd_HASH_ROUTER = Boolean(import.meta.env.VITE_ENABLE_HASH_ROUTER)
