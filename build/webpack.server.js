const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const WebpackShellPlugin = require('webpack-shell-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = (env, argv, IS_DEV = argv.mode !== 'production') => ({
  cache: IS_DEV,
  entry: './src/server/index.ts',
  stats: 'minimal',
  mode: argv.mode,
  target: 'node',
  watch: IS_DEV,
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname, '..', 'dist', 'server'),
    filename: 'index.js'
  },
  resolve: {
    extensions: [".ts", ".json"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json",
        logLevel: "info",
        extensions: [".ts", "json"]
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          configFile: path.join(__dirname, '..', 'tsconfig.json'),
        }
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DATABASE_URL': JSON.stringify(process.env.DATABASE_URL),
      'process.env.TWITTER_CONSUMER_KEY': JSON.stringify(process.env.TWITTER_CONSUMER_KEY),
      'process.env.TWITTER_CONSUMER_SECRET': JSON.stringify(process.env.TWITTER_CONSUMER_SECRET),
      'process.env.TWITTER_ACCESS_TOKEN': JSON.stringify(process.env.TWITTER_ACCESS_TOKEN),
      'process.env.TWITTER_ACCESS_TOKEN_SECRET': JSON.stringify(process.env.TWITTER_ACCESS_TOKEN_SECRET),
      'process.env.PRERENDER_TOKEN': JSON.stringify(process.env.PRERENDER_TOKEN),
      'process.env.USE_SSL': JSON.stringify(process.env.USE_SSL)
    }),
    new WebpackShellPlugin({
      onBuildEnd: IS_DEV ? ['npx nodemon ./dist/server/index.js --watch dist/server --delay 2.5'] : []
    })
  ]
})
