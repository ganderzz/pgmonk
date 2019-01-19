const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_PATH = path.resolve("dist");

module.exports = {
  entry: {
    vendor: ["react", "react-dom"],
    main: ["babel-polyfill", path.resolve(ROOT_DIR, "src", "index.tsx")],
  },
  output: {
    path: OUTPUT_PATH,
    publicPath: "./",
    filename: "[name].[hash].js",
    pathinfo: false,
  },
  context: ROOT_DIR,
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /.(ts|tsx)$/,
        loader: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /.css$/,
        loader: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT_DIR, "public", "index.html"),
      favicon: path.resolve(ROOT_DIR, "public", "favicon.ico"),
      inject: true,
    }),
  ],
};
