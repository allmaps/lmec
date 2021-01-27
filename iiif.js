// TODO: move to library @allmaps/iiif

function getCanvases (manifest) {
  if (manifest.sequences.length === 1) {
    const sequence = manifest.sequences[0]
    return sequence.canvases
  } else {
    throw new Error('Too many sequences in manifest!')
  }
}

function getImageResouce (canvas) {
  if (canvas.images.length === 1) {
    const image = canvas.images[0]
    return image.resource
  } else {
    throw new Error('Too many images in canvas!')
  }
}

function getImageDimensions (imageResource) {
  return [imageResource.width, imageResource.height]
}

function getImageServiceId (imageResource) {
  return imageResource.service['@id']
}

module.exports = {
  getCanvases,
  getImageResouce,
  getImageDimensions,
  getImageServiceId
}
