/* eslint-disable */

const prefixer = require('postcss-prefix-selector')

module.exports = (ctx) => {
  // development
  if (ctx.env === 'development') {
    return {
      plugins: [require('autoprefixer'), require('tailwindcss')]
    }
  }
  // production
  return {
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
}
