/**
 * @file Global config
 * @author Surmon <https://github.com/surmon-china>
 */

import { SizeType } from 'antd/lib/config-provider/SizeContext';

export const APP_TITLE = 'Surmon.me';
export const BLOG_HOST = '//surmon.me';
export const BLOG_SITE = `https:${BLOG_HOST}`;
export const STATIC_URL = 'https://static.surmon.me';
export const GRAVATAR_API = `${STATIC_URL}/avatar`;
export const ALIYUN_OSS_REGION = 'oss-cn-hangzhou';
export const ALIYUN_OSS_BUCKET = 'surmon-static';
export const GITHUB_REPO_NAME = 'veact-admin';
export const GITHUB_REPO_URL = 'https://github.com/surmon-china/veact-admin';

export const APP_AUTH_HEADER_KEY = 'Authorization';
export const APP_SIDER_WIDTH = 180;
export const APP_SIDER_COLLAPSED_WIDTH = 80;
export const APP_LAYOUT_GUTTER_SIZE = 24;
export const APP_LAYOUT_SPACE_SIZE: SizeType = 'large';
export const APP_CONTENT_SPACE_SIZE: SizeType = 'middle';
export const APP_COLOR_PRIMARY = '#177ddc';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

// export const API_URL = import.meta.env.VITE_API_URL as string;
export const API_URL = '/api';
export const ENV = import.meta.env.MODE as Environment;
export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;
