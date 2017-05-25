const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const MBTiles = require('mbtiles-offline')
const GeoPackage = require('geopackage')
const {tileToGoogle} = require('global-mercator')
const {EventEmitter} = require('events')

/**
 * MBTiles to OGC GeoPackage
 *
 * @param {string} mbtiles filepath
 * @param {string} geopackage filepath
 * @param {*} options options
 * @param {number} [options.interval=64] Update time interval in milliseconds
 * @returns {EventEmitter}
 */
function mbtiles2gpkg (mbtiles, geopackage, options = {}) {
  if (!fs.existsSync(mbtiles)) throw new Error('<mbtiles> does not exist')

  const db = new MBTiles(mbtiles)
  const ee = new EventEmitter()
  const interval = options.interval || 64
  let current = 0
  let errors = 0
  let total = 0
  let timer

  async function prestart () {
    // Calculate total tiles in MBTiles
    await db.validate()
    total = await db.count()

    // Create Folder if not exists
    const {dir} = path.parse(geopackage)
    if (!fs.existsSync(dir)) mkdirp.sync(dir)

    start()
  }

  async function start () {
    ee.emit('start', {current, errors, total})

    // Start Update counter
    timer = setInterval(update, interval)

    // Update GeoPackage Metadata
    const metadata = await db.metadata()
    const gpkg = new GeoPackage(geopackage)
    metadata.name = 'tiles'
    await gpkg.update(metadata)

    // Save each Tile from MBTiles to GeoPackage
    const tiles = await db.findAll()
    for (const tile of tiles) {
      const image = await db.findOne(tile)
      await gpkg.save(tileToGoogle(tile), image)
      current++
    }
    shutdown()
  }

  function update () {
    if (options.verbose === false) return
    ee.emit('update', {current, errors, total})
  }

  function shutdown () {
    clearTimeout(timer)
    ee.emit('end', {current, errors, total})
  }

  setTimeout(() => prestart())
  return ee
}

module.exports = mbtiles2gpkg
