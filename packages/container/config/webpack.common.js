const HtmlWebpackPlugin = require ( 'html-webpack-plugin' );

module.exports = {
  module: {
    rules: [
      {
        // test: /\.m?js$/,
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin ( {
      template: './public/index.html'
    } )
  ]
}
