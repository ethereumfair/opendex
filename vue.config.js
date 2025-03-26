const { defineConfig } = require('@vue/cli-service')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin //项目大小分析图
const path = require('path');
const webpack = require('webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,//关闭语法检查
  productionSourceMap: false,
  publicPath: './',
  parallel: false,
  assetsDir: './static',
  outputDir: 'dist',
  assetsDir: '',
  devServer: {
    hot: true, 
    port: 8080,
    open: true, 
    compress: true, 
    proxy: {
      '/api/*': {
        target: 'https://transfer.swft.pro',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  },
  configureWebpack: (config) =>{
    if (process.env.NODE_ENV === 'production'){
      return{
        resolve: {
          extensions: ['.js', '.vue', '.json'], 
           alias: {
             '@': path.resolve(__dirname, 'src'),
             "stream": "stream-browserify",
           },
           fallback: {
             "stream": require.resolve('stream-browserify'),
             "crypto": require.resolve("crypto-browserify"),
           },
         },
         optimization: {
           runtimeChunk: 'single',
           splitChunks: {
             chunks: 'async',
             maxInitialRequests: Infinity,
             minSize: 200000,
             maxSize: 600000, 
             minChunks: 1, 
             cacheGroups: {
               default: {
                 minChunks: 2, 
                 priority: -20,
                 reuseExistingChunk: true, 
               },
             }
           }
         },
         plugins: [
           new webpack.ProvidePlugin({
             Buffer: ['buffer', 'Buffer'],
           }),
           new CompressionPlugin({
             test: /\.(js|css)(\?.*)?$/i, 
             threshold: 10240, 
             deleteOriginalAssets: false, 
           }),
           new BundleAnalyzerPlugin()
         ]
      }
    }else{
      return{
        resolve: {
          extensions: ['.js', '.vue', '.json'], 
           alias: {
             '@': path.resolve(__dirname, 'src'),
             "stream": "stream-browserify"
           },
           fallback: {
             "stream": require.resolve('stream-browserify'),
             "crypto": require.resolve("crypto-browserify"),
           },
         },
         plugins: [
          new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
          }),
        ]
      }
    }
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true;
        return args;
      });
    }
  },
 
})
