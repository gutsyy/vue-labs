/* eslint-disable */

const purgecss = require('@fullhuman/postcss-purgecss')
const prefixer = require('postcss-prefix-selector')

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('tailwindcss'),
    purgecss({
      content: ['./src/index.html', './src/**/*.vue'],
      css: ['devextreme/dist/css/dx.light.css']
    }),
    prefixer({
      prefix: '.labs-devextreme'
    })
  ]
}
