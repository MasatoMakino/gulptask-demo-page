const path = require("path");
const glob = require("glob");

module.exports = (srcDir, distDir, prefix) => {
  const entries = {};
  glob
    .sync(`**/${prefix}*.js`, {
      cwd: srcDir,
    })
    .map((key) => {
      entries[key] = path.resolve(srcDir, key);
    });

  return {
    entry: entries,
    output: {
      path: path.resolve(process.cwd(), distDir),
      filename: "[name]",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
      ],
    },
    optimization: {},
  };
};
