const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const rimraf = require("rimraf");
const { CPA, stringify } = require("js-cpa");
const distDir = path.join(__dirname, "dist");
const fixtures = path.join(__dirname, "fixtures");

const runWebpack = (config, callback) => {
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    const compilation = stats.compilation;
    // Same as the webpack plugin
    // Much easier to test than mocking process.stdout and filename path
    const cpa = new CPA();
    Object.keys(compilation.assets).forEach(filename => {
      cpa.add(compilation.assets[filename].source(), { filename });
    });

    callback(cpa.findOptimalDuplicates());
  });
};

const getConfig = () => {
  return {
    entry: path.join(fixtures, "entry.js"),
    output: {
      path: distDir,
      filename: "bundle.js"
    }
  };
};

afterEach(() => {
  rimraf.sync(distDir);
});

test("should output duplicates across the bundle", done => {
  return runWebpack(getConfig(), duplicates => {
    expect(
      stringify(duplicates, { colors: false, newline: false })
    ).toMatchSnapshot();
    done();
  });
});
