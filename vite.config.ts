import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),AutoImport({
    imports: ['vue'],
    dts: 'src/auto-import.d.ts'
  })],
  server: {				// ← ← ← ← ← ←
    host: '0.0.0.0'	// ← 新增内容 ←
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
