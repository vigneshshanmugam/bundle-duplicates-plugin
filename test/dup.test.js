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
    const cpa = new CPA({ threshold: 1 });
    Object.keys(compilation.assets).forEach(filename => {
      cpa.add(compilation.assets[filename].source(), {
        filename
      });
    });

    callback(cpa.findOptimalDuplicates());
  });
};

const simpleConfig = {
  entry: path.join(fixtures, "simple", "entry.js"),
  output: {
    path: distDir,
    filename: "bundle.js"
  }
};

const commonChunksConfig = {
  entry: {
    page1: path.join(fixtures, "common-chunk", "page-1"),
    page2: path.join(fixtures, "common-chunk", "page-2")
  },
  output: {
    path: distDir,
    filename: "[name].js"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      chunks: ["page1", "page2"]
    })
  ]
};

afterEach(() => {
  rimraf.sync(distDir);
});

test("simple - should output duplicates", done => {
  return runWebpack(simpleConfig, duplicates => {
    expect(
      stringify(duplicates, {
        colors: false,
        newline: false
      })
    ).toMatchSnapshot();
    done();
  });
});

test("common chunks - should output duplicates", done => {
  return runWebpack(commonChunksConfig, duplicates => {
    expect(
      stringify(duplicates, {
        colors: false,
        newline: false
      })
    ).toMatchSnapshot();
    done();
  });
});
