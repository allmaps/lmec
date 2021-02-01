#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const H = require('highland')
const axios = require('axios')
const parse = require('csv-parse')

// TODO: move to @allmaps/iiif
const iiif = require('./iiif')
const transform = require('@allmaps/transform')
const annotationParser = require('@allmaps/annotation')

function createCsvStream (inputStream) {
  const parser = parse({
    delimiter: ',',
    columns: true
  })

  return H(inputStream.pipe(parser))
}

function readCsv (inputStream) {
  return new Promise((resolve, reject) => {
    createCsvStream(inputStream)
      .errors(reject)
      .toArray(resolve)
  })
}

async function readGcps (row) {
  const plateId = row.plate_ID
  const gcpsPath = path.join(__dirname, 'source', 'gcps', `${plateId}.tif.points`)

  if (fs.existsSync(gcpsPath)) {
    const manifestUri = `${row.repo_URI}/manifest.json`
    const manifest = await axios.get(manifestUri)
      .then((response) => response.data)

    const canvas = iiif.getCanvases(manifest)[0]
    const imageResource = iiif.getImageResouce(canvas)
    const imageServiceId = iiif.getImageServiceId(imageResource)
    const imageDimensions = iiif.getImageDimensions(imageResource)

    const gcpRows = await readCsv(fs.createReadStream(gcpsPath))

    const gcps = gcpRows.map((row) => ({
      image: [parseFloat(row.pixelX), -parseFloat(row.pixelY)],
      world: [parseFloat(row.mapX), parseFloat(row.mapY)]
    }))

    return {
      ...row,
      map: {
        imageServiceId,
        imageDimensions,
        gcps
      }
    }
  }
}

const boundary = JSON.parse(fs.readFileSync(path.join(__dirname, 'source', 'boundary.geojson')))
const polygonsByPlateId = boundary.features.reduce((byId, feature) => ({
  ...byId,
  [feature.properties.identifier]: feature.geometry
}), {})

createCsvStream(process.stdin)
  .flatMap((row) => H(readGcps(row)))
  .compact()
  .map((row) => {
    const plateId = row.plate_ID
    const polygon = polygonsByPlateId[plateId]
    const points = polygon.coordinates[0]

    const transformArgs = transform.createTransformer(row.map.gcps)

    const pixelMask = points
      .map((point) => transform.toImage(transformArgs, point))

    return {
      ...row.map,
      pixelMask
    }
  })
  .toArray((maps) => {
    const annotation = annotationParser.generate(maps)
    console.log(JSON.stringify(annotation, null, 2))
  })
