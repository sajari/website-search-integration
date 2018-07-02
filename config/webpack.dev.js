const { resolve } = require("path");
const merge = require("webpack-merge");
const config = require("./webpack.config");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const argv = require("yargs").option("integration", {
  describe: "integration type to run",
  choices: ["inline", "searchbox", "overlay", "dynamic-content"],
  default: "inline"
}).argv;

module.exports = merge(config, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, `../public/${argv.integration}.html`)
    })
  ]
});
