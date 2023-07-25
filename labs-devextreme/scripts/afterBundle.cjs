/* eslint-disable */

/**
 * help to replace devextreme classname `dx-` to `labs-` in js file
 * gutsyy 2023-07-25 created
 */

const path = require('path')

const fs = require('fs')

const entryPath = path.resolve(__dirname, '../dist/labs-devextreme.js')
const stylePath = path.resolve(__dirname, '../dist/style.css')

const processFlow = function (path, handler) {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.warn(`[afterBundle]: read ${path} failed`)
    }
    const fixFileStr = handler(data.toString())
    fs.writeFile(path, new Uint8Array(Buffer.from(fixFileStr)), (err) => {
      if (err) {
        console.warn(`[afterBundle]: write ${path} failed`)
      } else {
        console.log(`[afterBundle]: process bundled ${path} successful`)
      }
    })
  })
}

processFlow(entryPath, (str) => str.replaceAll('dx', 'labs'))
processFlow(stylePath, (str) => str.replaceAll('DATA-DX', 'DATA-LABS'))
