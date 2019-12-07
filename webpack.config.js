const path = require("path");
const glob = require("glob");

module.exports = (srcDir, distDir, prefix) => {
  const entries = {};
  glob
    .sync(`**/${prefix}*.js`, {
      cwd: srcDir
    })
    .map(key => {
      entries[key] = path.resolve(srcDir, key);
    });

  return {
    entry: entries,
    output: {
      path: path.join(__dirname, distDir),
      filename: "[name]",
      chunkFilename: "[name].bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: "initial",
            name: "vendor",
            test: /node_modules/,
            enforce: true
          }
        }
      }
    }
  };
};
