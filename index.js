const fs = require('fs')
const d3 = require('d3-queue')
const path = require('path')
const mkdirp = require('mkdirp')
const MBTiles = require('mbtiles-offline')
const GeoPackage = require('geopackage')
const {EventEmitter} = require('events')

/**
 * MBTiles to OGC GeoPackage
 *
 * @param {string} mbtiles filepath
 * @param {string} [geopackage] filepath
 * @param {*} [options] options
 * @param {number} [options.interval=64] Update time interval in milliseconds
 * @returns {EventEmitter}
 */
function mbtiles2gpkg (mbtiles, geopackage, options = {}) {
  if (!fs.existsSync(mbtiles)) throw new Error('<mbtiles> does not exist')

  if (!geopackage) {
    const {dir, name} = path.parse(mbtiles)
    geopackage = path.join(dir, name + '.gpkg')
  }

  const db = new MBTiles(mbtiles)
  const ee = new EventEmitter()
  const interval = options.interval || 64
  let current = 0
  let errors = 0
  let total = 0
  let timer

  function prestart () {
    const q = d3.queue(1)
    q.defer(callback => db.validate().then(() => callback(null)))
    q.defer(callback => db.count().then(count => {
      // Calculate total tiles in MBTiles
      total = count
      callback(null)
    }))
    q.awaitAll(() => {
      // Create Folder if not exists
      const {dir} = path.parse(geopackage)
      if (!fs.existsSync(dir)) mkdirp.sync(dir)
      start()
    })
  }

  function start () {
    ee.emit('start', {current, errors, total})

    // Start Update counter
    timer = setInterval(update, interval)

    // Update GeoPackage Metadata
    db.metadata().then(metadata => {
      const gpkg = new GeoPackage(geopackage)
      metadata.name = 'tiles'
      gpkg.update(metadata).then(() => {
        // Save each Tile from MBTiles to GeoPackage
        db.findAll().then(tiles => {
          const q = d3.queue(1)
          for (const tile of tiles) {
            q.defer(callback => {
              db.findOne(tile).then(image => {
                gpkg.save(tile, image).then(() => {
                  current++
                  callback(null)
                })
              })
            })
          }
          q.awaitAll(errors => {
            if (errors) throw new Error(errors)
            shutdown()
          })
        })
      })
    })
  }

  function update () {
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
