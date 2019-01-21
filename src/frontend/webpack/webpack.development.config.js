const webpack = require("./webpack.config");
const path = require("path");

const newOptions = {
  devServer: {
    publicPath: "/",
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    port: 3000,
    open: true,
    openPage: "",
    allowedHosts: ["*"],
  },
};

module.exports = Object.assign({}, webpack, newOptions);
