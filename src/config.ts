/**
 * @file Global config
 * @author Surmon <https://github.com/surmon-china>
 */

import type { SizeType } from 'antd/lib/config-provider/SizeContext'
import { Language } from '@/contexts/Locale'

export const APP_TITLE = 'Surmon.me'
export const BLOG_URL = `https://surmon.me`
export const GITHUB_REPO_URL = 'https://github.com/surmon-china/veact-admin'

export const APP_AUTH_HEADER_KEY = 'Authorization'
export const APP_CONTENT_SPACE_SIZE: SizeType = 'middle'
export const APP_LAYOUT_SPACE_SIZE: SizeType = 'large'
export const APP_LAYOUT_GUTTER_SIZE = 24
export const APP_PRIMARY_COLOR = '#0088f5'
export const APP_PRIMARY_LANGUAGE = Language.English

export const VITE_ENV = import.meta.env
export const ENV = import.meta.env.MODE
export const isDev = ENV === 'development'
export const BASE_PATH = import.meta.env.BASE_URL as string
export const API_URL = import.meta.env.VITE_API_URL as string
export const ENABLED_AD = Boolean(import.meta.env.VITE_ENABLE_AD)
export const ENABLED_HASH_ROUTER = Boolean(import.meta.env.VITE_ENABLE_HASH_ROUTER)
