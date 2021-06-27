/**
 * @file 全局配置
 * @author Surmon <https://github.com/surmon-china>
 */

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
export const APP_LAYOUT_SPACE_SIZE = 'large';
export const APP_CONTENT_SPACE_SIZE = 'middle';
export const APP_COLORS = Object.freeze({
  primary: '#177ddc',
  error: '#ff4d4f',
  warning: '#faad14',
  success: '#52c41a',
  info: '#1890ff',
});

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export const ENV = import.meta.env.MODE as Environment;
export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;
export const API_URL = import.meta.env.VITE_API_URL as string;
