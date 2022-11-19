const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin({
      root: __dirname,
      // exclude: ["favicon.ico"],
      verbose: true
    }),
  ],
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
          options: {
            mozjpeg: {
              quality: 85,
            },
            webp: {
              lossless: 1,
            },
            avif: {
              cqLevel: 0,
            },
          },
        },
      }),
    ],
  },
});
