const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const APP = path.resolve(`${__dirname}/app`)
const BUILD = path.resolve(`${__dirname}/build`)

const staticAssets = [{
  from: `${APP}/static`,
  to: `${BUILD}/`,
}]

const config = {
  entry: {
    app: [
      `${APP}/index.js`,
    ],
  },

  output: {
    pathinfo: false,
    path: BUILD,
    filename: '/[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    libraryTarget: 'var',
    library: 'naf',
    jsonpFunction: 'naf',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude:[/node_modules/],
        loader: 'babel',
      }, {
        test: /\.(glsl|svg)$/,
        exclude:[/node_modules/],
        loader: 'raw',
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin(staticAssets, {}),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      minimize: true,
      compress: {
        drop_debugger: true,
        drop_console: true,
        warnings: false,
      },
    }),
    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: `${APP}/index.html`,
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],

  devtool: '#source-map',
  profile: false,
  stats: {
    hash: true,
    version: true,
    timings: true,
    assets: true,
    chunks: true,
    modules: true,
    reasons: true,
    children: false,
    source: true,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: true,
  },
}

module.exports = config
