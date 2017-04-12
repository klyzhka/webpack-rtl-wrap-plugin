# webpack-rtl-wrap-plugin

[![npm version](https://badge.fury.io/js/webpack-rtl-wrap-plugin.svg)](https://badge.fury.io/js/webpack-rtl-wrap-plugin)

Wraps CSS files with `[dir=ltr|rtl]` to allow both RTL and LTR stylesheets loaded on the same page.

## Usage

```bash
npm install webpack-rtl-wrap-plugin --save-dev
```

> webpack.config.js

```js
// assuming you have some CSS files

const WebpackRTLPlugin = require('webpack-rtl-plugin')
const WebpackRTLWrapPlugin = require('webpack-rtl-wrap-plugin')

module.exports = {
  plugins: {
    // Creates .rtl.css
    new WebpackRTLPlugin(),
    // wraps CSS into [dir=ltr|rtl]
    new WebpackRTLWrapPlugin()
  }
}
```

> Add `[dir=ltr|rtl]` to the `html` node to apply a sylesheet.

```html
<!DOCTYPE html>
<html dir="ltr">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" href="css/app.css">
  <link rel="stylesheet" href="css/app.rtl.css">
</head>
<body>
  ...
</body>
</html>
```