const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const APP = path.resolve(`${__dirname}/app`)

module.exports = {
  devtool: '#source-map',

  entry: {
    app: [
      'webpack-hot-middleware/client',
      `${APP}/index.js`,
    ],
  },

  output: {
    path: __dirname + '/lib',
    filename: '[name].js',
    library: 'futuun',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude:[/node_modules/],
        loader: 'babel',
      }, {
        test: /\.glsl$/,
        exclude:[/node_modules/],
        loader: 'raw',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: `${APP}/index.html`,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
