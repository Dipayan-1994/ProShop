const configs = {};
require("fs")
  .readdirSync(__dirname + "/")
  .forEach(function (file) {
    // if (process.env.NODE_ENV === "development") {
    if (
      file.match(/\.js$/) &&
      !file.match(/\.prod\.js$/) &&
      file !== "index.js"
    ) {
      const name = Object.keys(require("./" + file))[0];
      configs[name] = require("./" + file)[name];
    }
    // }
  });

module.exports = configs;
