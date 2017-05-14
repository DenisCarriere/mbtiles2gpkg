const fs = require('fs-extra')
const {connect} = require('mbtiles-offline/utils')
const MBTiles = require('mbtiles-offline')

/**
 * MBTiles to OGC GeoPackage
 *
 * @param {string} mbtiles filepath
 * @param {string} geopackage filepath
 * @param {*} options options
 * @returns {void}
 */
async function mbtiles2geopackage (mbtiles, geopackage, options = {}) {
  if (!fs.existsSync(mbtiles)) throw new Error('<mbtiles> does not exist')

  const db = new MBTiles(mbtiles)
  const metadata = await db.metadata()

  // Validate MBTiles Metadata
  if (!metadata.name) throw new Error('<name> is required in metadata of MBTiles')
  if (!metadata.type) throw new Error('<type> is required in metadata of MBTiles')
  if (!metadata.version) throw new Error('<version> is required in metadata of MBTiles')
  if (!metadata.description) throw new Error('<description> is required in metadata of MBTiles')
  if (!metadata.format) throw new Error('<format> is required in metadata of MBTiles')

  await fs.copy(mbtiles, geopackage)
  updateGeoPackage(geopackage, metadata)
}

/**
 * Update Medata of GeoPackage
 *
 * @param {string} filepath
 * @return {void}
 */
function updateGeoPackage(geopackage, metadata) {
  const db = connect(geopackage)
  console.log(db)
}

// CREATE TABLE gpkg_spatial_ref_sys (
//   srs_name TEXT NOT NULL,
//   srs_id INTEGER NOT NULL PRIMARY KEY,
//   organization TEXT NOT NULL,
//   organization_coordsys_id INTEGER NOT NULL,
//   definition  TEXT NOT NULL,
//   description TEXT
// );

module.exports = mbtiles2geopackage
