const { merge } = require ( 'webpack-merge' );
const ModuleFederationPlugin = require ( 'webpack/lib/container/ModuleFederationPlugin' );
const commonConfig = require ( './webpack.common' );
const packageJson = require ( '../package.json' );

const devConfig = {
  mode: 'development',
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  output: {
    publicPath: 'http://localhost:8080/'
  },
  devServer: {
    port: 8080,
    historyApiFallback: {
      index: './public/index.html'
    }
  },
  
  plugins: [
    new ModuleFederationPlugin ( {
      name: 'container',
      remotes: [
        'product'
      ],
      shared: packageJson.dependencies
    } )
  ]
}

module.exports = merge ( commonConfig, devConfig );
