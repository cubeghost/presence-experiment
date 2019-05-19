require('dotenv').config();

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const findCacheDir = require('find-cache-dir');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackCleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const del = require('del');
const { flow, map, orderBy, slice } = require('lodash/fp');

const PROD = process.env.NODE_ENV === 'production';

const paths = {
  appBuild: path.resolve(__dirname, './build'),
  appHtml: path.resolve(__dirname, './src/index.html'),
  appPackageJson: path.resolve(__dirname, './package.json'),
  appSrc: path.resolve(__dirname, './src'),
  appNodeModules: path.resolve(__dirname, './node_modules'),
};

class HookPlugin {
  constructor(hooks, fn) {
    this.hooks = hooks;
    this.fn = fn;
  }

  apply(compiler) {
    const handler = params => {
      if (typeof this.fn === 'function') {
        this.fn(compiler, params);
      }
    }

    this.hooks.forEach(hook => {
      compiler.hooks[hook].tap('hook-webpack-plugin', handler);
    });
  }
}

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
        use: 'eslint-loader',
      },
      {
        test: /\.jsx?$/,
        include: [paths.appSrc],
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        include: [paths.appSrc],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader'
        ]
      }
    ],
  },
  optimization: {
    namedModules: true,
    concatenateModules: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
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
    new webpack.EnvironmentPlugin([
      'NODE_ENV', 
      'PROJECT_ID',
      'DEBUG'
    ]),
    new FriendlyErrorsWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new HookPlugin(['done', 'invalid'], (compilation) => {
      
      // delete all client bundles except the newest and second-newest
      // helps save disk space on glitch
      glob('build/client*.js', {}, (err, fileList) => {
        const files = flow(
          map(filename => {
            let timestamp = 0;
            try {
              timestamp = fs.statSync(filename).mtime.getTime()
            } catch(e) {}
            return {
              filename: filename,
              time: timestamp
            }
          }),
          orderBy(['time'], 'desc'),
          slice(2, fileList.length),
          map('filename'),
        )(fileList);
        
        if (files.length > 0) {
          del(files);
          console.log('cleaned old build files', files);
        }
        
      });
    })
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
