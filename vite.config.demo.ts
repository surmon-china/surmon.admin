import { UserConfig } from 'vite'

export const demoConfiger = (defaultConfig: UserConfig): UserConfig => {
  defaultConfig.plugins = defaultConfig.plugins || []
  defaultConfig.plugins.push({
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        `</head>`,
        `<script src="/__demo__/index.js"></script></head>`
      )
    },
  })
  return defaultConfig
}
