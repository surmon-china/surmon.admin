import { UserConfig } from 'vite'

const DEMO_BASE_PATH = '/veact-admin/'

export const demoConfiger = (defaultConfig: UserConfig): UserConfig => {
  return {
    ...defaultConfig,
    // base path
    base: DEMO_BASE_PATH,
    plugins: [
      ...defaultConfig.plugins,
      {
        name: 'demo-html-transform',
        transformIndexHtml(html) {
          return html.replace(
            `</head>`,
            // append mock entry
            `<script src="${DEMO_BASE_PATH}__demo__/index.js"></script></head>`
          )
        },
      },
    ],
  }
}
