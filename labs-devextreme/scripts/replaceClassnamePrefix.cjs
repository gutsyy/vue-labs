/* eslint-disable */

/**
 * help to replace devextreme classname `dx-` to `labs-` in js file
 * gutsyy 2023-07-25 created
 */

const path = require('path')

const fs = require('fs')

const entryPath = path.resolve(__dirname, '../dist/labs-devextreme.js')

const promise = new Promise((resolve, reject) => {
  fs.readFile(entryPath, (err, data) => {
    if (err) {
      reject(err)
    }
    console.log('[replace prefix]: read file successful')
    setTimeout(() => {
      resolve(data.toString())
    }, 500)
  })
})

promise
  .then((fileString) => {
    const replaceFileString = fileString.replaceAll('dx', 'labs')
    const buffer = new Uint8Array(Buffer.from(replaceFileString))
    fs.writeFile(entryPath, buffer, (err) => {
      if (err) throw err
      console.log('[replace prefix]: rewrite file successful')
    })
  })
  .catch((err) => {
    throw err
  })
