import path from 'path'
import { defineConfig, UserConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { proxyConfiger } from './vite.config.proxy'
import { demoConfiger } from './vite.config.demo'

// https://vitejs.dev/config/
const config: UserConfig = {
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/monaco-editor')) {
            return 'monaco-editor'
          } else if (
            ['lodash', 'marked', 'antd', '@ant-design', 'moment', 'highlight.js'].some(
              (exp) => id.includes(`/node_modules/${exp}`)
            )
          ) {
            return 'basic'
          } else if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
}

export default defineConfig(({ mode }) => {
  if (mode === 'proxy') {
    return proxyConfiger(config)
  }

  if (mode === 'demo') {
    return demoConfiger(config)
  }

  return config
})
