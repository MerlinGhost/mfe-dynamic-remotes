const HtmlWebPackPlugin = require ( 'html-webpack-plugin' );
const { ModuleFederationPlugin } = require ( 'webpack' ).container;
const path = require ( 'path' );

const deps = require ( './package.json' ).dependencies;

module.exports = ( _, __ ) => {
  
  return {
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
      path: path.resolve ( __dirname, 'dist' ),
      filename: 'bundle.js',
    },
    
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      port: 3002,
      open: false
    },
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
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
          use: ['style-loader', 'css-loader', 'postcss-loader'],
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
      new ModuleFederationPlugin ( {
        name: 'order',
        library: {
          type: 'module',
        },
        filename: 'remoteEntry.js',
        remotes: {},
        exposes: {
          './OrderApp': './src/remote-entry.ts',
        },
        shared: {
          ...deps,
          react: { singleton: true, requiredVersion: deps.react },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom']
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: deps['react-router-dom'],
          },
        },
      } ),
      
      new HtmlWebPackPlugin ( {
        template: './src/index.html',
      } ),
    
    ]
  }
}
