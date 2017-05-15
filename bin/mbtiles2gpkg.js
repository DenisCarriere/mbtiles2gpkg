#!/usr/bin/env node
const meow = require('meow')
const mbtiles2geopackage = require('../')

const cli = meow(`
  Usage:
    $ mbtiles2gpkg <MBTiles> <GeoPackage>
  Options:
    --verbose         [false] Verbose output
  Examples:
    $ mbtiles2gpkg example.mbtiles example.gpkg
`, {
  alias: {v: 'verbose'},
  boolean: ['verbose']
})

const mbtiles = cli.input[0]
const geopackage = cli.input[1]

mbtiles2geopackage(mbtiles, geopackage)
