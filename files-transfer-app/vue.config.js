const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessFile: './src/main/background.js',
      builderOptions: {
        extraResources: ['public/config.json']
      }
    },
  },
  pages: {
    index:{
      entry: './src/renderer/main.js'
    } 
  },
  configureWebpack: {
    devtool: 'source-map'
  }
})
