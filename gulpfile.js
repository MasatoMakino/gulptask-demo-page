"use strict";
const { bundleDemo, watchDemo } = require("./bin").get({
  externalScripts: ["https://code.createjs.com/1.0.0/createjs.min.js"],
  body: "<div></div>"
});

exports.bundleDemo = bundleDemo;
exports.watchDemo = watchDemo;
