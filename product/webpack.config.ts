import HtmlWebPackPlugin from 'html-webpack-plugin';
import webpack, { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { resolve } from 'path';

const deps = require ( './package.json' ).dependencies;

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const webpackConfig: Configuration = {
  experiments: {
    outputModule: true,
  },
  
  optimization: {
    minimize: true,
  },
  
  performance: {
    hints: false
  },
  
  entry: './src/remote-entry.ts',
  
  output: {
    path: resolve ( __dirname, 'dist' ),
    filename: 'product.bundle.js',
  },
  
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    port: 3001,
    historyApiFallback: true,
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.jsx', '.js', '.json' ],
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [ 'style-loader', 'css-loader', 'postcss-loader' ],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  
  plugins: [
    new webpack.container.ModuleFederationPlugin ( {
      name: 'product',
      library: {
        // Type of library (types included by default are 'var', 'module', 'assign',
        // 'assign-properties', 'this', 'window', 'self', 'global', 'commonjs', 'commonjs2',
        // 'commonjs-module', 'commonjs-static', 'amd', 'amd-require',
        // 'umd', 'umd2', 'jsonp', 'system', but others might be added by plugins).
        
        type: 'module',
      },
      filename: 'remoteEntry.js',
      remotes: {},
      exposes: {
        './ProductApp': './src/remote-entry.ts',
        './ProductCard': './src/Components/ProductCard.tsx'
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': {
          singleton: true,
          requiredVersion: deps[ 'react-dom' ]
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: deps[ 'react-router-dom' ],
        },
      },
    } ),
    
    new HtmlWebPackPlugin ( {
      template: './src/index.html',
    } ),
  
  ]
}

export default webpackConfig;
