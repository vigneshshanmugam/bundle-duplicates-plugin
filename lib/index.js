"use strict";

const { CPA, stringify } = require("js-cpa");

module.exports = class BundleDuplicatesPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const jsRegex = /\.js($|\?)/i;

    compiler.plugin("done", stats => {
      const compilation = stats.compilation;
      const cpa = new CPA(this.options);

      Object.keys(compilation.assets).forEach(filename => {
        if (!jsRegex.test(filename)) {
          return;
        }

        const asset = compilation.assets[filename];
        const code = asset.source();
        // Add the list of files that are outputed by webpack
        // existsAt makes it easy to navigate from the CLI to source location
        cpa.add(code, { filename: asset.existsAt || filename });
      });

      const duplicates = cpa.findOptimalDuplicates();
      // Ideas - We can also hack webpack stats to output as compilation warnings
      process.stdout.write(stringify(duplicates));
    });
  }
};
