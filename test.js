/// <reference types="node" />

const fs = require('fs')
const path = require('path')
const {test} = require('tap')
const mbtiles2geopackage = require('./')

const directories = {
  in: path.join(__dirname, 'test', 'in') + path.sep,
  out: path.join(__dirname, 'test', 'out') + path.sep
}

const fixtures = fs.readdirSync(directories.in).map(filename => {
  return {
    filename,
    name: path.parse(filename).name
  }
})

for (const {filename, name} of fixtures) {
  test(name, t => {
    const ee = mbtiles2geopackage(directories.in + filename, directories.out + name + '.gpkg')
    ee.on('start', status => t.assert(status))
    ee.on('end', status => t.end())
  })
}
