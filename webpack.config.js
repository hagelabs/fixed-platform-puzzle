const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const zlib = require('zlib');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const analyze = !!env?.analyze;
  const buildTarget = env?.target === 'itch' ? 'itch' : 'platform';

  const plugins = [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
      templateParameters: {
        BUILD_TARGET: buildTarget,
      },
      minify: isProduction
        ? {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
          }
        : false,
    }),
    new webpack.DefinePlugin({
      __BUILD_TARGET__: JSON.stringify(buildTarget),
    }),
  ];

  if (isProduction) {
    plugins.push(
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg|json)$/,
        compressionOptions: {
          params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
        },
        threshold: 1024,
        minRatio: 0.9,
      }),
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg|json)$/,
        threshold: 1024,
        minRatio: 0.9,
      })
    );
  }

  if (analyze) {
    plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: false, analyzerMode: 'static' }));
  }

  return {
    entry: './src/main.ts',
    output: {
      filename: isProduction ? 'game.[contenthash:8].js' : 'game.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins,
    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              extractComments: false,
              terserOptions: {
                compress: {
                  drop_console: false,
                  passes: 2,
                },
                format: { comments: false },
              },
            }),
          ],
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              phaser: {
                test: /[\\/]node_modules[\\/]phaser[\\/]/,
                name: 'phaser',
                chunks: 'all',
                priority: 10,
              },
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                chunks: 'all',
                priority: 5,
              },
            },
          },
        }
      : { minimize: false },
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      port: 3000,
      hot: true,
      compress: true,
      open: false,
      host: '0.0.0.0',
    },
    devtool: isProduction ? false : 'source-map',
    performance: {
      hints: false,
    },
  };
};
