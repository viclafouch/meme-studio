const path = require('path')
const nodeExternals = require('webpack-node-externals')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const WebpackShellPlugin = require('webpack-shell-plugin')

module.exports = (env, argv, IS_DEV = argv.mode !== 'production') => ({
  entry: './src/server/index.ts',
  mode: argv.mode,
  target: 'node',
  watch: IS_DEV,
  externals: [nodeExternals()],
  output: {
    path: path.resolve(process.cwd(), 'dist', 'server'),
    filename: 'index.js'
  },
  resolve: {
    extensions: [".ts", ".json"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json",
        logLevel: "info",
        extensions: [".ts"]
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          configFile: path.join(process.cwd(), '/tsconfig.json') // Need absolute
        }
      }
    ]
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: IS_DEV ? ['npx nodemon ./dist/server/index.js'] : []
    })
  ]
})
