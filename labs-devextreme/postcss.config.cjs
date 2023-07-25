/* eslint-disable */

const purgecss = require('@fullhuman/postcss-purgecss')
const prefixer = require('postcss-prefix-selector')

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('tailwindcss'),
    // help replace devextreme classname `dx-` to `labs-` in .css file
    prefixer({
      prefix: '',
      transform: function (prefix, selector) {
        if (selector.includes('dx-')) {
          return selector.replaceAll('dx-', 'labs-')
        }
        return selector
      }
    })
  ]
}
