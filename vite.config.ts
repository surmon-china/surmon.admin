import path from 'path'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, UserConfig } from 'vite'
import { proxyConfiger } from './vite.config.proxy'
import { demoConfiger } from './vite.config.demo'

// https://vitejs.dev/config/
const config: UserConfig = {
  plugins: [viteReact()],
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
          const incs = (ds: string[]) => ds.some((d) => id.includes(`node_modules/${d}`))
          if (incs(['monaco-editor'])) {
            return 'monaco-editor'
          } else if (incs(['axios', 'lodash', 'marked', 'moment', 'highlight.js'])) {
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
