const { resolve } = require("path");

const VERSION = require("../package.json").version;

module.exports = {
  target: "web",
  entry: {
    "website-search": resolve(__dirname, "../src/index.ts")
  },
  output: {
    path: resolve(__dirname, "../dist"),
    filename: `[name]-${VERSION}.js`
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
  }
};
