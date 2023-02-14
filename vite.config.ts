import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
      // antd: path.join(__dirname, 'node_modules/antd/dist/antd.js'),
      // '@ant-design/icons': path.join(
      //   __dirname,
      //   'node_modules/@ant-design/icons/dist/index.umd.js'
      // )
    }
  },
  plugins: [react(), dynamicImport()],
  server: {
    // 开启浏览器
    open: false,
    // 允许开发时跨域
    cors: true,
    // 允许外部访问
    host: '0.0.0.0'
  }
})
