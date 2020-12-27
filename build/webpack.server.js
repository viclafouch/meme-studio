/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const WebpackShellPluginNext = require('webpack-shell-plugin-next')
const Dotenv = require('dotenv-webpack')

module.exports = (env, argv) => {
  const IS_DEV = argv.mode === 'development'
  const config = {
    entry: './src/server/index.ts',
    stats: 'minimal',
    target: 'node',
    watch: IS_DEV,
    externals: [nodeExternals()],
    output: {
      path: path.join(__dirname, '..', 'dist', 'server'),
      filename: 'index.js'
    },
    node: {
      global: true
    },
    resolve: {
      extensions: ['.ts', '.json'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: './tsconfig.json',
          logLevel: 'info',
          extensions: ['.ts', 'json']
        })
      ]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            configFile: path.join(__dirname, '..', 'tsconfig.json')
          }
        }
      ]
    },
    plugins: []
  }

  if (IS_DEV) {
    config.plugins.push(
      new WebpackShellPluginNext({
        onBuildEnd: {
          scripts: ['npx nodemon ./dist/server/index.js --watch dist/server --delay 2.5']
        }
      })
    )
  } else {
    config.plugins.push(
      new Dotenv({
        path: path.resolve(process.cwd(), '.env')
      })
    )
  }

  return config
}
