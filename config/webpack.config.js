const { resolve } = require("path");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const VERSION = require("../package.json").version.split(".");
const [VERSION_MAJOR, VERSION_MINOR] = VERSION;

module.exports = {
  target: "web",
  entry: {
    "website-search": resolve(__dirname, "../src/index.ts")
  },
  output: {
    path: resolve(__dirname, "../dist"),
    filename: `[name]-${VERSION_MAJOR}.${VERSION_MINOR}.js`
  },
  module: {
    rules: [
      {
        test: [/\.js$/, /\.tsx?/],
        exclude: [/node_modules/],
        use: "babel-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            ascii_only: true,
            ecma: 5
          }
        }
      })
    ]
  }
};
