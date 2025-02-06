const rspack = require("@rspack/core");
const { defineConfig } = require("@rspack/cli");
const path = require("path");

const config = defineConfig({
  entry: {
    index: path.resolve(__dirname, "./src/entries-index.js"),
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "./rspack-dist"),
  },
  target: "web",
  mode: "production",
  experiments: {
    css: true,
  },
  plugins: [
    new rspack.ProvidePlugin({
      process: [require.resolve("process/browser")],
    }),
    new rspack.HtmlRspackPlugin({
      template: path.resolve(__dirname, "./rspack-entries-html/index.html"),
      filename: "index.htm",
      chunks: ["index"],
      minify: true,
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "builtin:lightningcss-loader",
            options: {},
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            env: {
              targets: ["chrome >= 48"],
            },
            jsc: {
              externalHelpers: false,
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
              transform: {
                react: {
                  development: false,
                  refresh: false,
                },
              },
            },
          },
        },
        type: "javascript/auto",
      },
    ],
  },
});

module.exports = config;
