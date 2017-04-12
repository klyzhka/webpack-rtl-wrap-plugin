const async = require('async')
const path = require('path')
const postcss = require('postcss')

const WebpackRTLWrapPlugin = function(options = {}) {
  this.options = options
}

WebpackRTLWrapPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    async.eachOfLimit(compilation.chunks, 5, (chunk, key, cb) => {
      let promise = Promise.resolve()

      chunk.files.forEach((file) => {
        const asset = compilation.assets[file]
        const isRTL = file.indexOf('.rtl.css') !== -1
        if (path.extname(file) === '.css') {
          promise = promise.then(() => { 
            return postcss([
              require('postcss-wrap')({ selector: '[dir=' + (isRTL ? 'rtl' : 'ltr') + ']', skip: /^html/ })
            ])
            .process(asset.source(), {}).then(function (result) {
              asset.source = () => result.css
              asset.size = () => result.css.length
            })
          })
        }
      })

      promise.then(() => cb())
    }, callback)
  })
}

module.exports = WebpackRTLWrapPlugin