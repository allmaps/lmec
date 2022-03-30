# LMEC Map Warper data to Allmaps

This repository contains scripts that convert data from the Map Warper instance at the Leventhal Map & Education Center at the Boston Public Library (LMEC) to the [Allmaps API](https://github.com/allmaps/annotation/tree/develop) format.

Source data:

- [LMEC's Map Warper ground control points (GCPs)](./data/bpl-mapwarper_control-points-data_1639766994.json)

Conversion:

    npm install
    npm run gcps
    npm run manifests

Resulting files:

- [`maps.ndjson`](./data/maps.ndjson)
- [`manifests.ndjson`](./data/manifests.ndjson)

These files can be uploaded to the Allmaps API using the following commands. To run them, first install [HTTPie](https://httpie.io/cli).

    http POST http://dev.api.allmaps.org/maps < ./data/maps.ndjson
    http POST http://dev.api.allmaps.org/manifests < ./data/manifests.ndjson

_Note: these API calls are currently for internal use only._
