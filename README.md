# gulptask-demo-page

demo html generator for gulp.js

[GitHub](https://github.com/MasatoMakino/gulptask-demo-page.git)

## Getting Started

### Install

```bash
$ npm install https://github.com/MasatoMakino/gulptask-demo-page.git -D
```

### Import

Import tasks in gulpfile.js.

```gulpfile.js
"use strict";
const { bundleDemo, watchDemo } = require("gulptask-demo-page").get();
```

### How to use

Export tasks in gulpfile.js.

```gulpfile.js
exports.bundleDemo = bundleDemo;
exports.watchDemo = watchDemo;
```

## Option

You can set options when you initialize a task.

Example

```gulpfile.js
const { bundleDemo, watchDemo } = require("./bin").get({
  externalScripts: ["https://code.createjs.com/1.0.0/createjs.min.js"],
  body: "<div></div>"
});
```

- prefix (default : "demo") : The word contained in the name of the demo script.
- srcDir (default : "./demoSrc") : Directory where demo scripts are stored.
- distDir (default : "./docs/demo") : Directory where html files are output.
- externalScripts (default :\[]) : A list of external javascript libraries.
- body (default : "") : Content stored in the < body > tag.
- style (default : "") : Common style for demo html.
- copyTargets (default :\["png", "jpg", "jpeg"]) : Static assets in srcDir. These are copied to distDir.

## npm script

- build : build gulptask-demo-page bin.
- watch : watch src dir and build bin.

## License

[MIT licensed](LICENSE).
