import { UserConfig } from 'vite'

export const demoConfiger = (defaultConfig: UserConfig): UserConfig => {
  return {
    ...defaultConfig,
    plugins: [
      ...defaultConfig.plugins,
      {
        name: 'demo-html-transform',
        transformIndexHtml(html) {
          return html.replace(
            `</head>`,
            // append mock entry
            `<script src="/__demo__/index.js"></script></head>`
          )
        },
      },
    ],
  }
}
