const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const dotenv = require('dotenv')
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

dotenv.config()

module.exports = (env, argv) => ({
  mode: env.production ? 'production' : 'development',
  entry: {
    index: ['@babel/polyfill', path.resolve(__dirname, 'src/index.jsx')]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  devtool: !env.production ? 'source-map' : false,
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 5000,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: ExtractCssChunksPlugin.loader,
            options: {
              hot: true,
              reloadAll: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: !env.production
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !env.production
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: ExtractCssChunksPlugin.loader,
            options: {
              hot: true,
              reloadAll: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: !env.production,
              modules: {
                localIdentName: env.production
                  ? '[hash:base64:5]'
                  : '[path][name]__[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !env.production
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !env.production
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: 'public' }]),
    new ExtractCssChunksPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      hot: true
    }),
    new webpack.EnvironmentPlugin(['MAPBOX_TOKEN']),
    ...(env.production
      ? [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        })
      ]
      : [new webpack.HotModuleReplacementPlugin()])
  ]
})
