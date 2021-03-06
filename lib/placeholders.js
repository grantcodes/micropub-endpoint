const config = require('./config')

const keys = ['mediaBaseUrl', 'siteBaseUrl']

const add = url => {
  for (const key of keys) {
    if (url && typeof url === 'string') {
      url = url.replace(config.get(key), `{{${key}}}`)
    }
  }
  return url
}

const replace = url => {
  for (const key of keys) {
    if (url && typeof url === 'string') {
      url = url.replace(`{{${key}}}`, config.get(key))
    } else if (
      url &&
      typeof url === 'object' &&
      url.value &&
      typeof url.value === 'string'
    ) {
      url.value = url.value.replace(`{{${key}}}`, config.get(key))
    }
  }
  return url
}

const replaceMf2 = mf2 => {
  // Undo placeholder on url
  if (mf2.properties.url) {
    mf2.properties.url = mf2.properties.url.map(replace)
  }
  // Undo placeholders on children
  if (mf2.children) {
    mf2.children = mf2.children.map(replace)
  }

  // Undo placeholders on media
  if (mf2.properties.photo) {
    mf2.properties.photo = mf2.properties.photo.map(replace)
  }
  if (mf2.properties.video) {
    mf2.properties.video = mf2.properties.video.map(replace)
  }
  if (mf2.properties.audio) {
    mf2.properties.audio = mf2.properties.audio.map(replace)
  }

  // Undo placeholders on image sizes
  if (mf2.cms && mf2.cms.imageSizes) {
    for (let imageUrl in mf2.cms.imageSizes) {
      let sizes = Object.assign({}, mf2.cms.imageSizes[imageUrl])
      for (const size in sizes) {
        sizes[size] = replace(sizes[size])
      }
      mf2.cms.imageSizes[replace(imageUrl)] = sizes
      if (imageUrl !== replace(imageUrl)) {
        delete mf2.cms.imageSizes[imageUrl]
      }
    }
  }
  return mf2
}

module.exports = {
  add,
  replace,
  replaceMf2,
}
