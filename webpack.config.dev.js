'use strict';

var webpack = require('webpack');
var path = require('path');

var devServerPort = 8080;

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:' + devServerPort,
    'webpack/hot/only-dev-server',
    './lib/main'
  ],
  output: {
    path: __dirname + '/src/assets/js/',
    filename: 'main.js',
    publicPath: 'http://localhost:8080/assets/js/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js'],
    alias: {
      modernizr$: path.resolve(__dirname, ".modernizrrc")
    }
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, loaders: ['react-hot', 'babel-loader'], exclude: /node_modules/},
      {test: /\.scss$/, loader: 'style!css!autoprefixer!sass'},
      {test: /\.(png|svg)$/, loader: "url-loader?limit=8192"},
      {test: /\.json$/, loader: "json-loader"},
      {test: /\.glsl$/, loader: "webpack-glsl"},
      {test: /\.modernizrrc$/, loader: "modernizr"}
    ]
  },
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    hot: true,
    port: devServerPort
  }
}