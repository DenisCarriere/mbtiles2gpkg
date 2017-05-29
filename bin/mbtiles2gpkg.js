#!/usr/bin/env node

const meow = require('meow')
const ProgressBar = require('progress')
const mbtiles2geopackage = require('../')

const cli = meow(`
  Usage:
    $ mbtiles2gpkg <MBTiles> [GeoPackage]
  Options:
    --interval        [64]    Update time interval in milliseconds
    --silent          [false] Disables progress bar output
  Examples:
    $ mbtiles2gpkg example.mbtiles
`, {
  boolean: ['silent']
})

const mbtiles = cli.input[0]
let geopackage = cli.input[1]
const silent = cli.flags.silent
const interval = cli.flags.interval

const ee = mbtiles2geopackage(mbtiles, geopackage, {interval})

if (!silent) {
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
