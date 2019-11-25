const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = () => ({
  cache: false,
  devtool: 'source-map',
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  entry: "./src/ts/index.tsx",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index_bundle.js"
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
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/html/index.html"
    })
  ]
})
