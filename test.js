/// <reference types="node" />

const fs = require('fs')
const path = require('path')
const {test} = require('tap')
const mbtiles2gpkg = require('./')

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
    const ee = mbtiles2gpkg(directories.in + filename, directories.out + name + '.gpkg', {interval: 16})
    ee.on('start', status => t.true(status.total > 0))
    ee.on('update', status => t.true(status.total > 0))
    ee.on('end', status => t.end())
  })
}
