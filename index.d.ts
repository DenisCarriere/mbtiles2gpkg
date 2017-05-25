import {EventEmitter} from 'events'

interface Options {
  interval?: number
}

interface Status {
  current?: number
  errors?: number
  total?: number
}

interface Events extends EventEmitter {
  on(type: 'start', callback: (status: Status) => void): this;
  on(type: 'update', callback: (status: Status) => void): this;
  on(type: 'end', callback: (status: Status) => void): this;
}

declare function mbtiles2gpkg(mbtiles: string, geopackage: string, options?: Options): Events
declare namespace mbtiles2gpkg {}
export = mbtiles2gpkg
