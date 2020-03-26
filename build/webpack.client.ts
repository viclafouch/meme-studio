import { Configuration } from 'webpack'
import * as path from 'path'
import { PORT_CLIENT_DEV, IS_DEV } from '../src/shared/config'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries")

const clientConfig: Configuration = {
  cache: true,
  stats: 'minimal',
  target: "web",
  resolve: {
    alias: {
      '@client/components': path.resolve(__dirname, '../src/client/ts/components'),
      '@client/containers': path.resolve(__dirname, '../src/client/ts/containers'),
      '@client/ts/shared': path.resolve(__dirname, '../src/client/ts/shared'),
      '@client/store': path.resolve(__dirname, '../src/client/ts/store'),
      '@client/utils': path.resolve(__dirname, '../src/client/ts/utils'),
      '@client': path.resolve(__dirname, '../src/client')
    },
    extensions: ['.tsx', '.scss']
  },
  entry: {
    main: path.join(__dirname, '..', 'src', 'client', 'ts', 'index.tsx'),
    styles: path.join(__dirname, '..', 'src', 'client', 'scss', 'styles.scss')
  },
  output: {
    path: path.join(__dirname, '..', 'dist', 'client')
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

export default clientConfig
