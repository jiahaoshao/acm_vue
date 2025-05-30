const config = require("./public/static/config.json");

const api_url = config.api_url;
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    open: true, //启动项目是否自动弹出浏览器
    port: 8080, //开发服务器的端口号
    host: '127.0.0.1',  //开发服务器的主机名
    https: true, //是否开启https协议
    proxy: {
      '/api': {
        target: api_url, // 目标服务器地址,也就是后端服务地址
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {
          '^/api': '' // 重写路径
        }
      },
      '/chatapi': {
        target: 'https://api.x.ai/', // 目标服务器地址,也就是后端服务地址
        secure: true,
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {
          '^/chatapi': '' // 重写路径
        }
      },
      '/artapi': {
        target: 'https://aip.baidubce.com/', // 目标服务器地址,也就是后端服务地址
        secure: true,
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {
          '^/artapi': '' // 重写路径
        }
      },
    }
  },
  // 输出文件目录
  outputDir: 'dist',

  // 静态资源目录
  assetsDir: 'static',
})
