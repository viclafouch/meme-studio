import * as path from "path"
import { IS_DEV, PORT_CLIENT_DEV } from "./src/shared/config"
import * as HtmlWebpackPlugin from "html-webpack-plugin"
import * as MiniCssExtractPlugin from "mini-css-extract-plugin"
import * as CopyPlugin from "copy-webpack-plugin"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
import { Configuration } from 'webpack';

const config: Configuration = {
  cache: false,
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'inline-source-map' : false,
  resolve: {
    alias: {
      '@client/components': path.resolve(__dirname, './src/client/ts/components'),
      '@client/containers': path.resolve(__dirname, './src/client/ts/containers'),
      '@client/shared': path.resolve(__dirname, './src/client/ts/shared'),
      '@client/store': path.resolve(__dirname, './src/client/ts/store'),
      '@client/utils': path.resolve(__dirname, './src/client/ts/utils'),
      '@client': path.resolve(__dirname, './src/client/ts'),
      '@api': path.resolve(__dirname, './src/api/lib'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@src': path.resolve(__dirname, './src')
    },
    extensions: [".ts", ".tsx", ".js", ".json", ".scss"]
  },
  entry: {
    main: path.join(__dirname, 'src', 'client', 'ts', 'index.tsx'),
    styles: path.join(__dirname, 'src', 'client', 'scss', 'styles.scss')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `[name]-[hash:8]-bundle.js`,
    chunkFilename: '[name]-[hash:8]-bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: PORT_CLIENT_DEV,
    overlay: IS_DEV,
    open: IS_DEV,
    openPage: `http://localhost:${PORT_CLIENT_DEV}`,
    historyApiFallback: true
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
              prependData: "@import './src/client/scss/global/mixins';",
            },
          }
        ],
        exclude: /node_modules/
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: false,
      protectWebpackAssets: true
    }),
    new HtmlWebpackPlugin({
      template: "./src/client/html/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css'
    }),
    new CopyPlugin([ { from: 'src/client/img', to: 'images' } ]),
    new CopyPlugin([ { from: 'public', to: 'public' } ])
  ]
}

export default config
