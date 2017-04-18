const async = require('async')
const postcss = require('postcss')
const RawSource = require('webpack-sources').RawSource
const merge  = require('lodash.merge')
const Cache = require('fs-simple-cache')

class WebpackRTLWrapPlugin {
  constructor (options = {}) {
    this.options = merge({
      testCss: /\.css?$/,
      testIsRTL: /\.rtl\.css?$/
    }, options)
  }

  apply (compiler) {
    const cache = new Cache(this.options)
    compiler.plugin('emit', (compilation, callback) => {
      async.eachOfLimit(compilation.chunks, 5, (chunk, key, cb) => {
        let promise = Promise.resolve()

        chunk.files.forEach((file) => {
          const asset = compilation.assets[file]
          const isRTL = this.options.testIsRTL.test(file)
          
          if (this.options.testCss.test(file)) {
            const source = asset.source()
            const key = source + isRTL
            let content
            if (content = cache.get(key).content) {
              promise = promise.then(() => content)
            }
            else {
              promise = promise.then(() => { 
                return postcss([
                  require('postcss-wrap')({ selector: '[dir=' + (isRTL ? 'rtl' : 'ltr') + ']', skip: /^html/ })
                ])
                .process(source, {}).then(function (result) {
                  cache.put(key, { content: result.css })
                  return result.css
                })
              })
            }
            promise = promise.then(result => {
              compilation.assets[file] = new RawSource(result)
            })
          }
        })

        promise.then(() => cb())
      }, callback)
    })
  }
}

module.exports = WebpackRTLWrapPlugin