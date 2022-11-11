import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// import vitePluginImp from 'vite-plugin-imp'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  server: {
    port: 4321,
    proxy: {
      '^/app': {
        target: 'http://localhost:9991',
        changeOrigin: true
      },
      '^/oauth2': {
        target: 'http://localhost:3846',
        changeOrigin: true
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        globalVars: {
          primaryColor: '#F21212'
        },
        // modifyVars: {
        //   'root-entry-name': 'variable'
        // },
        javascriptEnabled: true
      }
    }
  },
  plugins: [
    react(),
    // vitePluginImp({
    //   libList: [
    //     {
    //       libName: 'antd',
    //       style: name => `antd/es/${name}/style/index.js`
    //     }
    //   ]
    // }),
    WindiCSS()
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      }
    ]
  }
})
