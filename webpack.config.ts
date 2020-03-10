import * as path from "path"
import { IS_DEV } from "./src/shared/config"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
import { Configuration } from 'webpack';
import clientConfig from './build/webpack.client'
const merge = require('webpack-merge')

const configs = {
  client: clientConfig
}

const config: Configuration = merge(configs.client, {
  cache: false,
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'inline-source-map' : false,
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
      '@src': path.resolve(__dirname, './src')
    },
    extensions: [".ts", ".js", ".json"]
  },
  output: {
    filename: `[name]-[hash:8]-bundle.js`,
    chunkFilename: '[name]-[hash:8]-bundle.js'
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
      }
    ]
  },
  plugins: [new CleanWebpackPlugin()]
})

export default config
