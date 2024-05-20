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
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
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
  if (mode === 'proxy') {
    return proxyConfiger(config)
  }

  if (mode === 'demo') {
    return demoConfiger(config)
  }

  return config
})
