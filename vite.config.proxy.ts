import { loadEnv, UserConfig } from 'vite'

export const proxyConfiger = (defaultConfig: UserConfig): UserConfig => {
  const prodEnv = loadEnv('production', '.')
  return {
    ...defaultConfig,
    server: {
      ...defaultConfig.server,
      proxy: {
        ...defaultConfig.server?.proxy,
        // only for development env
        '/api': {
          target: prodEnv.VITE_API_URL,
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true,
          headers: {
            origin: 'https://surmon.me',
            referer: 'https://surmon.me',
          },
        },
      },
    },
  }
}
