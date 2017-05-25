#!/usr/bin/env node

const path = require('path')
const meow = require('meow')
const ProgressBar = require('progress')
const mbtiles2geopackage = require('../')

const cli = meow(`
  Usage:
    $ mbtiles2gpkg <MBTiles> [GeoPackage]
  Options:
    --interval        [64]    Update time interval in milliseconds
    --verbose         [false] Verbose output
  Examples:
    $ mbtiles2gpkg example.mbtiles example.gpkg
`, {
  alias: {v: 'verbose'},
  boolean: ['verbose']
})

const mbtiles = cli.input[0]
let geopackage = cli.input[1]
if (!geopackage) {
  const {dir, name} = path.parse(mbtiles)
  geopackage = path.join(dir, name + '.gpkg')
}
const verbose = cli.flags.verbose
const interval = cli.flags.interval

const ee = mbtiles2geopackage(mbtiles, geopackage, {interval})

if (verbose) {
  ee.on('start', ({total}) => {
    const bar = new ProgressBar('  converting [:bar] :rate/bps :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total
    })
    ee.on('update', ({current}) => bar.update(current / total))
    ee.on('end', ({current}) => bar.update(current / total))
  })
}
