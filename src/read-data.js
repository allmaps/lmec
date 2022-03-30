import { readFile } from 'fs/promises'

export default JSON.parse(
  await readFile(
    new URL(
      '../data/bpl-mapwarper_control-points-data_1639766994.json',
      import.meta.url
    )
  )
)
