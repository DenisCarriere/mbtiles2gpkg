const MBTiles = require('mbtiles-offline')

/**
 * MBTiles to OGC GeoPackage
 *
 * @param {string} mbtiles file path
 * @param {string} geopackage file path
 * @param {*} options options
 * @returns {void}
 */
async function mbtiles2geopackage (mbtiles, geopackage, options = {}) {
  const db = new MBTiles(mbtiles)
  const metadata = await db.metadata()
  console.log(metadata)
}

module.exports = mbtiles2geopackage
