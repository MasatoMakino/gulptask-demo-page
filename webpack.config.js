const path = require("path");
const glob = require("glob");

module.exports = (srcDir, distDir, prefix) => {
  const entries = {};
  glob
    .sync(`**/${prefix}*.+(js|ts)`, {
      cwd: srcDir,
    })
    .map((key) => {
      const parsed = path.parse(key);
      const name = path.format({
        dir: parsed.dir,
        name: parsed.name,
      });
      entries[name] = path.resolve(srcDir, key);
    });

  return {
    entry: entries,
    output: {
      path: path.resolve(process.cwd(), distDir),
      filename: "[name].js",
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
        {
          test: /\.ts$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            configFile: "This setting has been overridden in 'Bundler.ts'",
            onlyCompileBundledFiles: true,
          },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    optimization: {},
  };
};
