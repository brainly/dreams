const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const sgPackageJson = require('brainly-style-guide/package.json');

module.exports = {
  entry: {
    app: './src/index.jsx',
    driver: {
      import: './driver/index.ts',
      library: {
        name: 'driver',
        type: 'umd',
      },
    },
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].bundle.js',
  },
  devServer: {
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            projectReferences: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/templates/index.html',
      version: sgPackageJson.version,
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      SG_VERSION: sgPackageJson.version,
    }),
  ],
};
