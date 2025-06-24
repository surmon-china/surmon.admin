import path from 'path'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, UserConfig } from 'vite'
import { withProxyConfig } from './vite.config.proxy'
import { withDemoConfig } from './vite.config.demo'
import packageJSON from './package.json'

// https://vite.dev/config
const defaultConfig: UserConfig = {
  plugins: [viteReact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJSON.version)
  },
  server: {
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/antd') || id.includes('@ant-design/icons')) {
            return 'antd'
          } else if (id.includes('node_modules/@codemirror')) {
            return 'codemirror'
          } else if (id.includes('node_modules/echarts')) {
            return 'echarts'
          }
        }
      }
    }
  }
}

export default defineConfig(({ mode }) => {
  if (mode === 'proxy') return withProxyConfig(defaultConfig)
  if (mode === 'demo') return withDemoConfig(defaultConfig)
  return defaultConfig
})
