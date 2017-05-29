# MBTiles to OGC GeoPackage

[![Build Status](https://travis-ci.org/DenisCarriere/mbtiles2gpkg.svg?branch=master)](https://travis-ci.org/DenisCarriere/mbtiles2gpkg)
[![npm version](https://badge.fury.io/js/mbtiles2gpkg.svg)](https://badge.fury.io/js/mbtiles2gpkg)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/DenisCarriere/mbtiles2gpkg/master/LICENSE)
[![Coverage Status](https://coveralls.io/repos/github/DenisCarriere/mbtiles2gpkg/badge.svg?branch=master)](https://coveralls.io/github/DenisCarriere/mbtiles2gpkg?branch=master)

<!-- Line Break -->

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

A [NodeJS 6.x](https://nodejs.org/en/) CLI tool to convert MBTiles to OGC GeoPackage.

## Install

```bash
$ yarn global add mbtiles2gpkg
```

## Quickstart

```bash
$ mbtiles2gpkg world.mbtiles
converting [===============     ] 513/bps 77% 2.4s
```
## Usage

```bash
$ mbtiles2gpkg --help

  MBTiles to OGC GeoPackage

  Usage:
    $ mbtiles2gpkg <MBTiles> [GeoPackage]
  Options:
    --interval        [64]    Update time interval in milliseconds
    --silent          [false] Disables progress bar output
  Examples:
    $ mbtiles2gpkg example.mbtiles
```
