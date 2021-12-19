/**
 * Created by miaozhendong@live.com on 2019/6/10.
 */
const path = require('path')
// const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')// 引入gzip压缩插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { merge } = require('webpack-merge')
const tsImportPluginFactory = require('ts-import-plugin')
const WebpackBar = require('webpackbar')
const devServer = require('./devServer.config')
const isDev = process.env.NODE_ENV === 'development'

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

// vue.config.js 详情参考：https://cli.vuejs.org/zh/config/#vue-config-js
module.exports = {
  // 服务配置
  devServer: {
    ...devServer
  },
  // 配置选项...
  publicPath: './', // 部署应用包时的根路径
  runtimeCompiler: false, // 是否使用包含运行时编译器的 Vue 构建版本。
  productionSourceMap: false, // 关闭生产环境source map，加速生产环境构建，并减少包体积
  lintOnSave: true, // 保存时 lint 代码
  // CSS配置
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    extract: !isDev,
    // 是否开启 CSS source map？
    sourceMap: process.env.NODE_ENV !== 'production',
    // 为预处理器的 loader 传递自定义选项。
    loaderOptions: {
      postcss: {
        plugins: []
      },
      sass: {
        // 引入全局变量 @/ 是 src/ 的别名
        prependData: '@import "@/assets/styles/_var.scss";'
      },
      less: {
        lessOptions: {
          modifyVars: {
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            // hack: 'true; @import "@/assets/styles/variables.less";'
          }
        }
      }
    }
  },
  // webpack基础配置
  configureWebpack: config => {
    // 配置polyfill
    // config.entry.app = ['babel-polyfill', './src/main.js']
    // 插件
    config.plugins.push(
      // 控制台显示打包时间
      new WebpackBar({
        name: 'data-manager'
      })
    )
    if (process.env.IS_OPEN_GZIP === 'open') {
      // if (!isDev) {
      // config.plugins.push(new BundleAnalyzerPlugin())
      config.plugins.push(
        new CompressionPlugin({ // gzip压缩配置
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: !isDev ? 10240 : 1024, // 对超过10kb的数据进行压缩
          deleteOriginalAssets: false // 是否删除原文件
        })
      )
      // 为生产环境修改配置...
      // config.plugins.push(new SkeletonWebpackPlugin({
      //   webpackConfig: {
      //     entry: {
      //       app: path.join(__dirname, './src/config/skeleton.js')
      //     }
      //   },
      //   minimize: true,
      //   quiet: true
      // }))
    } else if (process.env.NODE_ENV === 'analyze') {
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  },
  // 修改webpack相关配置
  chainWebpack: config => {
    // 配置文件alias
    config.resolve.alias
      .set('@assets', resolve('src/assets'))
      .set('@config', resolve('src/config'))
      .set('@types', resolve('src/types'))
      .set('@components', resolve('src/components'))
      .set('@layout', resolve('src/views/layout'))
      .set('@utils', resolve('src/assets/scripts/utils'))
      .set('@styles', resolve('src/assets/styles'))
      .set('@views', resolve('src/views'))

    config.optimization.minimizer('terser').tap((args) => {
      // 去除生产环境console
      args[0].terserOptions.compress.drop_console = true
      return args
    })
    if (!isDev) {
      // 去除多余提示
      config.performance.set('hints', false)
      config.devtool('none')
      // 代码分割
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'vendors-chunk',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          },
          utils: {
            name: 'chunk-utils',
            test: resolve('src/assets/utils'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          },
          plugins: {
            name: 'chunk-plugins',
            test: resolve('src/assets/plugins'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
    }
    config.output.filename('[name].[hash].js').end()
    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/assets/images/svgs')).end()
    config.module.rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/images/svgs'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: name => `${name}/style/less`
              })
            ]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        })
        return options
      })
  },
  // 第三方插件的选项
  pluginOptions: {
    // ...
  }
}
