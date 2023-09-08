const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/meeting/",
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
  devServer: {
    proxy: {
      "/ctapi": {
        target: "https://jsczh.hzcjtz.com:8006/",
        changeOrigin: true,
        pathRewrite: {
          "/ctapi": "",
        },
      },
      "^/api": {
        target: "https://meeting.hzcjtz.com:8080",
        changeOrigin: true,
      },
    },
  },
});
