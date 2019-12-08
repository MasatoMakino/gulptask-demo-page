"use strict";
const { bundleDemo, watchDemo, generateHTML } = require("./bin").get({externalScripts:["https://code.createjs.com/1.0.0/createjs.min.js"]});

exports.bundleDemo = bundleDemo;
exports.watchDemo = watchDemo;
exports.generateHTML = generateHTML;