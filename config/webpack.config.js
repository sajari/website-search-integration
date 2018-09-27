const { resolve } = require("path");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const SizePlugin = require("size-plugin");

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
        loader: "babel-loader",
        options: {
          configFile: resolve(__dirname, "../.babelrc")
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    alias: {
      dlv$: resolve("node_modules", "dlv/dist/dlv.es.js")
    }
  },
  plugins: [new SizePlugin()],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        minify(file, sourceMap) {
          let options = {
            parse: {
              ecma: 8
            },
            output: {
              ascii_only: true,
              ecma: 5
            }
          };

          if (sourceMap) {
            options.sourceMap = {
              content: sourceMap
            };
          }

          return require("terser").minify(file, options);
        }
      })
    ]
  }
};
