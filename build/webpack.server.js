const path = require('path')
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
    new WebpackShellPlugin({
      onBuildEnd: IS_DEV ? ['npx nodemon ./dist/server/index.js --watch dist/server --delay 2.5'] : []
    })
  ]
})
