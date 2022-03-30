#!/usr/bin/env node

import fetch from 'node-fetch'

import { parseIiif } from '@allmaps/iiif-parser'

import bplControlPoints from './read-data.js'

for (let { map: mapWarperMap } of bplControlPoints.maps) {
  const imageArkId = mapWarperMap.image_ark_id

  const imageUri = `https://iiif.digitalcommonwealth.org/iiif/2/${imageArkId}`

  const imageInfo = await fetch(`${imageUri}/info.json`).then((response) =>
    response.json()
  )
  const image = parseIiif(imageInfo)

  const { width, height } = image

  const map = {
    image: {
      uri: imageUri,
      version: 2,
      quality: 'default',
      format: 'jpg',
      width,
      height
    },
    pixelMask: [
      [0, 0],
      [width, 0],
      [width, height],
      [0, height]
    ],
    gcps: mapWarperMap.control_points.map(({ x, y, lat, lon }) => ({
      image: [x, y],
      world: [lon, lat]
    }))
  }

  console.log(JSON.stringify(map))
}
