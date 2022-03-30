#!/usr/bin/env node

import bplControlPoints from './read-data.js'

for (let { map: mapWarperMap } of bplControlPoints.maps) {
  const arkId = mapWarperMap.ark_id

  const manifestUri = `https://collections.leventhalmap.org/search/${arkId}/manifest`

  console.log(JSON.stringify(manifestUri))
}
