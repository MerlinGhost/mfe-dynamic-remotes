const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require ( 'path' );

const packageJson = require("../package.json");

module.exports = (_, __) => ({
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  
  output: {
    path: path.resolve ( __dirname, 'dist' ),
    filename: '[name].[contenthash].js',
    publicPath: 'http://localhost:3000/'
  },

  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      // "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    port: 3000,
    historyApiFallback: {
      index: '/index.html'
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "main",
      remotes : ["product", "order", "delivery"],
      exposes: {},
      shared: packageJson.dependencies
      // shared: {
      //   ...deps,
      //   react: {
      //     singleton: true,
      //     requiredVersion: deps.react,
      //   },
      //   "react-dom": {
      //     singleton: true,
      //     requiredVersion: deps["react-dom"],
      //   },
      //   "react-router-dom": {
      //     singleton: true,
      //     requiredVersion: deps["react-router-dom"],
      //   },
      // },
    }),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
    }),
    // new CopyWebpackPlugin({
    //   patterns: [{ from:'public/', to:'' }]
    // })
    
  ],
});
