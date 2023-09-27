import path from "path";
import * as glob from "glob";

const initEntries = (srcDir, prefix) => {
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

  return entries;
};

const defaultOption = {
  devtool: "eval-source-map",
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
    extensionAlias: {
      ".js": [".ts", ".js"],
      ".mjs": [".mts", ".mjs"],
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          name: "vendor",
          test: /node_modules/,
          enforce: true,
        },
      },
    },
  },
};

export default (srcDir, distDir, prefix) => {
  return {
    entry: initEntries(srcDir, prefix),
    output: {
      path: path.resolve(process.cwd(), distDir),
      filename: "[name].js",
    },
    ...defaultOption,
  };
};
