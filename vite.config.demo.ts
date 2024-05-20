import { UserConfig } from 'vite'

const DEMO_BASE_PATH = '/surmon.admin/'
const GOOGLE_ANALYTICS_MEASUREMENT_ID = 'G-WNSSKPKKMG'
const GOOGLE_ADSENSE_CLIENT_ID = 'ca-pub-4710915636313788'

const DEMO_HACK_SCRIPT = `<script src="${DEMO_BASE_PATH}__demo__/index.js"></script>`

const GOOGLE_ANALYTICS_TAG_SCRIPT = `
<script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GOOGLE_ANALYTICS_MEASUREMENT_ID}');
</script>
`

const GOOGLE_ADSENSE_SCRIPT = `
<script
  async
  crossorigin="anonymous"
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT_ID}"
></script>
`

export const demoConfiger = (defaultConfig: UserConfig): UserConfig => {
  return {
    ...defaultConfig,
    // base path
    base: DEMO_BASE_PATH,
    plugins: [
      ...Array.from(defaultConfig.plugins!),
      {
        name: 'demo-html-transform',
        transformIndexHtml(html) {
          return html.replace(
            `<!-- DEMO_SLOT -->`,
            [DEMO_HACK_SCRIPT, GOOGLE_ANALYTICS_TAG_SCRIPT, GOOGLE_ADSENSE_SCRIPT].join('\n')
          )
        }
      }
    ]
  }
}
