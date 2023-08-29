import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    commonjsOptions: {
      // https://stackoverflow.com/questions/73125972/the-requested-module-node-modules-vite-deps-vue-js-does-not-provide-an-expor/73131693#73131693
      esmExternals: true
    },
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      name: '@gutsyy/labs-devextreme'
    },
    rollupOptions: {
      external: [
        'vue',
        'devextreme',
        'devextreme-vue',
        'devextreme-vue/popup',
        'devextreme-vue/check-box',
        'devextreme-vue/date-box',
        'devextreme-vue/number-box',
        'devextreme-vue/radio-group',
        'devextreme-vue/select-box',
        'devextreme-vue/text-box',
        'devextreme-vue/text-area',
        'devextreme-vue/drop-down-box',
        'devextreme-vue/tree-view',
        'devextreme-vue/tag-box',
        'devextreme-vue/button',
        'devextreme/data/array_store'
      ],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
