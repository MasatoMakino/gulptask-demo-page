"use strict";
const { bundleDemo, cleanDemo, watchDemo } = require("./bin").generateTasks({
  externalScripts: [
    "https://code.createjs.com/1.0.0/createjs.min.js",
    "https://code.createjs.com/1.0.0/tweenjs.min.js",
  ],
  body: "<div></div>",
  style: `canvas{background-color:#000}`,
  rules: [
    {
      test: /\.(vert|frag|glsl)$/,
      use: [
        {
          loader: "webpack-glsl-loader",
        },
      ],
    },
  ],
  copyTargets: ["ai", "psd"],
});

exports.bundleDemo = bundleDemo;
exports.cleanDemo = cleanDemo;
exports.watchDemo = watchDemo;
