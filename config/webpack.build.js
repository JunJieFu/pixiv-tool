const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(require("./webpack.base"), {
  mode: "production",
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "..", "build"),
    publicPath: "./",
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        exclude: /\.min\.js$/,
        cache: true,
        parallel: true,
        sourceMap: false,
        terserOptions: {
          warnings: false,
        },
      }),
      new OptimizeCSSAssetsPlugin(),
      //删除注释
      new UglifyJsPlugin({
        uglifyOptions: {
          // 删除注释
          output: {
            comments: false,
          },
        },
      }),
    ],
    // 不抽离多文件
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: "common",
    //       priority: 10,
    //       chunks: "all",
    //       enforce: true,
    //     },
    //   },
    // },
  },
});
