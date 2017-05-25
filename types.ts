import * as mbtiles2gpkg from './'

const ee = mbtiles2gpkg('example.mbtiles', 'example.gpkg', {interval: 50})

ee.on('start', () => console.log('go'))
ee.on('end', status => console.log(status.total))
