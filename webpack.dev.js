const webpack = require('webpack');
const { merge } = require('webpack-merge');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  performance: {
    hints: "warning"
  },

  plugins: [new webpack.HotModuleReplacementPlugin(), new BundleAnalyzerPlugin()],
});
