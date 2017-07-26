# bundle-duplicates-plugin
Identify duplicate functions across all webpack JS bundles.

It uses [js-cpa](https://github.com/vigneshshanmugam/js-cpa/) for analysing the duplicates.

### Install

```sh
npm i --save-dev bundle-duplicates-plugin
```

### Usage

```js
// webpack.config.js
const BundleDuplicatesPlugin = require("bundle-duplicates-plugin");
module.exports = {
  entry: //...,
  output: //...,
  plugins: [
    new BundleDuplicatesPlugin({
      // options
    })
  ]
}
```

### Options

All options as mentioned [here](https://github.com/vigneshshanmugam/js-cpa/#options)

