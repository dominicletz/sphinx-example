var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

// puts .env into actual env
require('dotenv').config({silent: true});

var outputPath = 'public/builds';

function buildPluginList() {
  var plugins = [
    // make sure we can use Promise / fetch without importing them
    // Always use bluebird even if native promises exist, only use fetch if we need to
    new webpack.ProvidePlugin({
      'Promise': 'bluebird',
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
  ];

  if(process.env.NODE_ENV === 'production') {
    console.log('building production plugin list');
    plugins = plugins.concat([
      new webpack.DefinePlugin({
        API_BASE_URL: JSON.stringify('')
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin()
    ]);
  } else {
    console.log('building non-production plugin list');
    var apiBaseUrl = JSON.stringify(process.env.API_BASE_URL || '');
    console.log('apiBaseUrl: ', apiBaseUrl);
    plugins.push(new webpack.DefinePlugin({
      API_BASE_URL: apiBaseUrl,
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    }));
  }

  plugins.push(new ExtractTextPlugin('style.css'));

  return plugins;
}

module.exports = {
  entry: './app/index.js',

  output: {
    path: outputPath,
    filename: 'bundle.js',
    publicPath: 'builds/'
  },

  plugins: buildPluginList(),

  devtool: 'cheap-module-source-map',

  devServer: {
    contentBase: path.resolve(__dirname, '../app'),
    historyApiFallback: true,
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot',
          'babel-loader?presets[]=es2015&presets[]=react&plugins[]=transform-object-rest-spread'
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test:   /\.scss/,
        loader: ExtractTextPlugin.extract('style', 'css!sass'),
      },
      {
        test:   /\.html/,
        loader: 'html'
      }
    ]
  }
}
