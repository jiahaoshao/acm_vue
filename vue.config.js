
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    // open: true, //启动项目是否自动弹出浏览器
    // port: 8080, //开发服务器的端口号
    // host: 'localhost',  //开发服务器的主机名
    proxy: {
      '/api': {
        target: 'http://26.201.192.85:8181/', // 目标服务器地址,也就是后端服务地址
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {
          '^/api': '' // 重写路径
        }
      },
      '/chatapi': {
        target: 'https://api.x.ai', // 目标服务器地址,也就是后端服务地址
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {
          '^/chatapi': '' // 重写路径
        }
      }
    }
  }
})
