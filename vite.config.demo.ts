import { UserConfig } from 'vite'

const DEMO_BASE_PATH = '/veact-admin'

export const demoConfiger = (defaultConfig: UserConfig, mode: string): UserConfig => {
  const isBuild = mode === 'build'
  // base URL
  if (isBuild) {
    defaultConfig.base = DEMO_BASE_PATH
  }

  defaultConfig.plugins = defaultConfig.plugins || []
  defaultConfig.plugins.push({
    name: 'html-transform',
    transformIndexHtml(html) {
      // 1. export sub path
      // 2. append mock entry
      const basePath = isBuild ? DEMO_BASE_PATH : ''
      return html.replace(
        `</head>`,
        [
          `<script>window.basePath = "${basePath}";</script>`,
          `<script src="${basePath}/__demo__/index.js"></script>`,
          `</head>`,
        ].join('\n')
      )
    },
  })
  return defaultConfig
}
