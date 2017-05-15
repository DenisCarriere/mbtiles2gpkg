const fs = require('fs-extra')
const path = require('path')
const test = require('tape')
const mbtiles2geopackage = require('./')

const directory = path.join(__dirname, 'test') + path.sep

test('mbtiles2geopackage', async t => {
  await mbtiles2geopackage(directory + 'world_zoom_0-2.mbtiles', directory + 'world_zoom_0-2.gpkg')
  await mbtiles2geopackage(directory + 'canada_zoom_0-3.mbtiles', directory + 'canada_zoom_0-3.gpkg')
  await mbtiles2geopackage(directory + 'fiji_zoom_0-4.mbtiles', directory + 'fiji_zoom_0-4.gpkg')
  t.end()
})
