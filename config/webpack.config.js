const { resolve } = require("path");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const VERSION = require("../package.json").version;

module.exports = {
  target: "web",
  entry: {
    "website-search": resolve(__dirname, "../src/index.js")
  },
  output: {
    path: resolve(__dirname, "../dist"),
    filename: `[name]-${VERSION}.js`
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: {
            loader: "postcss-loader",
            options: {
              config: {
                path: resolve(__dirname, "./postcss.config.js")
              }
            }
          }
        })
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [new ExtractTextPlugin(`[name]-${VERSION}.css`)],
  resolve: {
    extensions: [".js"],
    alias: {
      react: "preact-compat",
      "react-dom": "preact-compat",
      "create-react-class": "preact-compat/lib/create-react-class"
    }
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            ascii_only: true
          }
        }
      })
    ]
  }
};
