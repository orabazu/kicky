const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: './src/index.tsx',
  target: 'web',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].[contenthash:8].js",
    chunkFilename: "[name].[chunkhash:8].bundle.js",
    publicPath: '/',
  },
  optimization: {
    minimize: true,
    moduleIds: 'deterministic',
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 10,
      minSize: 0,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      }
    }
  },
  resolve: {
    alias: {
      types: path.resolve(__dirname, './src/types/'),
      const: path.resolve(__dirname, './src/const/'),
      components: path.resolve(__dirname, './src/components/'),
      views: path.resolve(__dirname, './src/views/'),
      reducers: path.resolve(__dirname, './src/reducers/'),
      hooks: path.resolve(__dirname, './src/hooks/'),
      assets: path.resolve(__dirname, './src/assets/'),
      services: path.resolve(__dirname, './src/services/'),
      actions: path.resolve(__dirname, './src/actions/'),
      lib: path.resolve(__dirname, './src/lib/'),
      store: path.resolve(__dirname, './src/store/'),
      utils: path.resolve(__dirname, './src/utils/'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'babel-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
      },
      {
        test: /\.module\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: '@teamsupercell/typings-for-css-modules-loader',
            options: {
              banner:
                '// autogenerated by typings-for-css-modules-loader. \n// Please do not change this file!',
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader', // postcss loader needed for tailwindcss
            options: {
              postcssOptions: {
                ident: 'postcss',
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#34d499',
                  'body-background': '#1b1b22',
                  'font-size-base': '14px',
                  'btn-height-base': '40px',
                  'btn-font-weight': 'bold',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|ico|svg|json)$/,
        type: 'asset/resource',
      },
      {
        test: /\.json$/,
        loader: 'file-loader'
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      favicon: './src/assets/favicon.ico',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/fonts", to: "fonts" },
      ]
    }),
    new Dotenv({
      systemvars: true,
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 8080,
    hot: true,
    proxy: {
      '/image': {
        target: 'https://yb6is4z7hh.execute-api.eu-central-1.amazonaws.com/prod',
        pathRewrite: { '^/image': '' },
        changeOrigin: true,
        secure: false,
      },
    },
  }
};
