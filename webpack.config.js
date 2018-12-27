require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const findCacheDir = require('find-cache-dir');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackCleanPlugin = require('clean-webpack-plugin');
const HappyPack = require('happypack');
/* eslint-disable new-cap */
const happyThreadPool = HappyPack.ThreadPool({ size: 8 });

const PROD = process.env.NODE_ENV === 'production';

const paths = {
  appBuild: path.resolve(__dirname, './build'),
  appHtml: path.resolve(__dirname, './src/index.html'),
  appFavicon: path.resolve(__dirname, './src/assets/favicon.png'),
  appPackageJson: path.resolve(__dirname, './package.json'),
  appSrc: path.resolve(__dirname, './src'),
  appNodeModules: path.resolve(__dirname, './node_modules'),
};

const config = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    client: path.join(paths.appSrc, 'client.js')
  },
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: '[name].[hash:8].js',
    sourceMapFilename: '[name].[hash:8].js.map',
    publicPath: '/',
  },
  resolve: {
    modules: [paths.appSrc, paths.appNodeModules],
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: [/node_modules/],
        include: [paths.appSrc],
        use: ['happypack/loader?id=eslint'],
      },
      {
        test: /\.jsx?$/,
        include: [paths.appSrc],
        use: ['happypack/loader?id=babel'],
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|otf|woff|woff2)$/,
        include: [paths.appSrc],
        loader: 'file-loader',
      }
    ],
  },
  optimization: {
    namedModules: true,
    concatenateModules: true,
  },
  plugins: [
    new HappyPack({
      id: 'babel',
      threadPool: happyThreadPool,
      verbose: false,
      debug: false,
      loaders: [
        {
          loader: 'babel-loader',
          query: {
            cacheDirectory: findCacheDir({
              name: 'experiment-happypack-cache',
            }),
          },
        },
      ],
    }),
    new HappyPack({
      id: 'eslint',
      threadPool: happyThreadPool,
      verbose: false,
      debug: false,
      loaders: [
        {
          loader: 'eslint-loader',
          options: {
            configFile: path.join(__dirname, 'eslint.js'),
            useEslintrc: false,
            cache: false,
            formatter: require('eslint-formatter-pretty'),
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      // favicon: paths.appFavicon,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new SimpleProgressWebpackPlugin({
      format: 'compact',
    }),
    new FriendlyErrorsWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new WebpackCleanPlugin([`${paths.appBuild}/client.*.js`]),
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.mode = 'production';
  config.devtool = 'source-map';
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  };

  config.plugins.push(
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6,
      },
    }),
  );
}

module.exports = config;
