const fs = require('fs-extra')
const {tileToGoogle} = require('global-mercator')
const GeoPackage = require('geopackage')
const MBTiles = require('mbtiles-offline')

/**
 * MBTiles to OGC GeoPackage
 *
 * @param {string} mbtiles filepath
 * @param {string} geopackage filepath
 * @param {*} options options
 * @returns {void}
 */
async function mbtiles2gpkg (mbtiles, geopackage, options = {}) {
  if (!fs.existsSync(mbtiles)) throw new Error('<mbtiles> does not exist')

  const db = new MBTiles(mbtiles)
  const metadata = await db.metadata()

  // Validate MBTiles Metadata
  if (!metadata.name) throw new Error('<name> is required in metadata of MBTiles')
  if (!metadata.type) throw new Error('<type> is required in metadata of MBTiles')
  if (!metadata.version) throw new Error('<version> is required in metadata of MBTiles')
  if (!metadata.description) throw new Error('<description> is required in metadata of MBTiles')
  if (!metadata.format) throw new Error('<format> is required in metadata of MBTiles')

  return saveGeoPackage(db, geopackage, metadata)
}

/**
 * Update Medata of GeoPackage
 *
 * @param {MBTiles} mbtiles
 * @param {string} filepath
 * @return {void}
 */
async function saveGeoPackage (mbtiles, geopackage, metadata) {
  const gpkg = new GeoPackage(geopackage)
  metadata.name = 'tiles'
  await gpkg.update(metadata)

  // MBTiles uses TMS & GeoPackage uses Google tile schema
  const tiles = await mbtiles.findAll()
  for (const tile of tiles) {
    const image = await mbtiles.findOne(tile)
    await gpkg.save(tileToGoogle(tile), image)
  }
  return true
}

module.exports = mbtiles2gpkg
