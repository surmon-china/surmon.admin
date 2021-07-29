import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

const isProxyDev = Boolean(process.env.PROXY)
const prodEnv = loadEnv('production', '.')

// https://vitejs.dev/config/
export default defineConfig({
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
    proxy: {
      '/api': {
        target: isProxyDev ? prodEnv.VITE_API_URL : 'http://localhost:8000',
        changeOrigin: true,
        headers: {
          origin: 'https://surmon.me',
          referer: 'https://surmon.me',
        },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/monaco-editor')) {
            return 'monaco-editor'
          } else if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
