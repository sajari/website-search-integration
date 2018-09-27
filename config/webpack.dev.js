const { resolve } = require("path");
const merge = require("webpack-merge");
const config = require("./webpack.config");

module.exports = merge(config, {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    filename: `[name]-dev.js`
  },
  devServer: {
    contentBase: resolve(__dirname, "../examples")
  }
});
