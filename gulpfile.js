"use strict";
const { bundleDemo, watchDemo } = require("./bin").get({
  externalScripts: ["https://code.createjs.com/1.0.0/createjs.min.js","https://code.createjs.com/1.0.0/tween.min.js" ],
  body: "<div></div>",
  style: `canvas{background-color:#000}`
});

exports.bundleDemo = bundleDemo;
exports.watchDemo = watchDemo;
