const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessFile: './src/electron/main.js',
      builderOptions: {
        extraResources: ['public/config.json']
      }
    },
  },
  pages: {
    index:{
      entry: './src/vueRenderer/main.js'
    } 
  },
  configureWebpack: {
    devtool: 'source-map'
  }
})
