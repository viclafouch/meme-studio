import { Configuration } from 'webpack'
import * as path from 'path'
import { PORT_CLIENT_DEV } from '../src/shared/config'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const clientConfig = (env: any, argv: any, IS_DEV = argv.mode !== 'production'): Configuration => {
  return {
    cache: true,
    stats: 'minimal',
    target: "web",
    mode: IS_DEV ? 'development' : 'production',
    devtool: IS_DEV ? 'inline-source-map' : false,
    output: {
      filename: `[name]-[hash:8]-bundle.js`,
      chunkFilename: '[name]-[hash:8]-bundle.js',
      path: path.join(__dirname, '..', 'dist', 'client')
    },
    resolve: {
      alias: {
        '@client/components': path.resolve(__dirname, '../src/client/ts/components'),
        '@client/containers': path.resolve(__dirname, '../src/client/ts/containers'),
        '@client/ts/shared': path.resolve(__dirname, '../src/client/ts/shared'),
        '@client/store': path.resolve(__dirname, '../src/client/ts/store'),
        '@client/utils': path.resolve(__dirname, '../src/client/ts/utils'),
        '@client': path.resolve(__dirname, '../src/client'),
        '@shared': path.resolve(__dirname, '../src/shared'),
        '@src': path.resolve(__dirname, '../src')
      },
      extensions: ['.tsx', '.scss', ".ts", ".js", ".json"]
    },
    entry: {
      main: path.join(__dirname, '..', 'src', 'client', 'ts', 'index.tsx'),
      styles: path.join(__dirname, '..', 'src', 'client', 'scss', 'styles.scss')
    },
    devServer: {
      port: PORT_CLIENT_DEV,
      overlay: IS_DEV,
      open: IS_DEV,
      openPage: `http://localhost:${PORT_CLIENT_DEV}`,
      historyApiFallback: true,
      clientLogLevel: 'silent'
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader'
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: IS_DEV,
                reloadAll: IS_DEV
              }
            },
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                prependData: "@import './src/client/scss/global/mixins';"
              }
            }
          ],
          exclude: /node_modules/
        }
      ]
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      new FixStyleOnlyEntriesPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '..', 'src', 'client', 'html', 'index.html'),
        env: {
          IS_DEV
        }
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash:8].css'
      }),
      new CopyPlugin([ { from: path.join(__dirname, '..', 'src', 'client', 'img'), to: 'images' } ]),
      new CopyPlugin([ { from: 'static', to: 'static' } ])
    ]
  }
}

export default clientConfig
