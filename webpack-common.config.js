//
// Copyright 2019 DXOS.org
//

const path = require('path');
const Dotenv = require('dotenv-webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const VersionFile = require('webpack-version-file-plugin');
const webpack = require('webpack');

const PUBLIC_URL = process.env.PUBLIC_URL || '';

const CONFIG_FILE = path.relative('./src', process.env.CONFIG_FILE || 'config-local.yml');

module.exports = {
  devtool: 'eval-source-map',

  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 600
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "dist")
    },
    compress: true,
    allowedHosts: "all",
    port: 8080
  },

  resolve: {
    fallback: {
      fs: false
    }
  },

  output: {
    path: `${__dirname}/dist/production`,
    filename: '[name].bundle.js',
    publicPath: PUBLIC_URL
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name (module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            if (packageName.startsWith('@cerc-io')) {
              return 'cerc-io';
            }

            if (packageName.startsWith('@material-ui')) {
              return 'material-ui';
            }

            return 'vendor';
          }
        }
      }
    }
  },

  plugins: [

    // https://www.npmjs.com/package/dotenv-webpack#properties
    new Dotenv({
      path: process.env.DOT_ENV || '.env'
    }),

    // NOTE: Must be defined below Dotenv (otherwise will override).
    // https://webpack.js.org/plugins/environment-plugin
    // new webpack.EnvironmentPlugin({}),

    // Define the build config file based on the target.
    // https://webpack.js.org/plugins/normal-module-replacement-plugin
    new webpack.NormalModuleReplacementPlugin(/(.*)__CONFIG_FILE__/, (resource) => {
      resource.request = resource.request.replace(/__CONFIG_FILE__/, CONFIG_FILE);
    }),

    // https://www.npmjs.com/package/webpack-version-file-plugin
    new VersionFile({
      template: path.join(__dirname, 'version.ejs'),
      packageFile: path.join(__dirname, 'package.json'),
      outputFile: path.join(__dirname, 'src', 'version.json')
    }),

    new NodePolyfillPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      // https://github.com/eemeli/yaml-loader
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader'
      }
    ]
  }

};
