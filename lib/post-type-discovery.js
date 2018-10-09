const emojiList = require('emojis-list')

/**
 * Checks if a string is a single emoji
 * @param {string} text String to test
 */
const isSingleEmoji = text => {
  text = text.trim()
  return emojiList.indexOf(text) > -1
}

/**
 * Discover the post type from a mf2 json object.
 * Mostly borrowed from https://github.com/EdwardHinkle/abode. Thanks Eddie
 * @param {object} post A mf2 json object
 */
module.exports = post => {
  if (post.properties.rsvp) {
    return 'rsvp'
  }
  if (post.properties['in-reply-to']) {
    if (post.properties.content && post.properties.content[0]) {
      let content = post.properties.content[0]
      if (typeof content !== 'string') {
        if (content.value) {
          content = content.value
        } else if (content.html) {
          content = content.html
        }
      }
      if (isSingleEmoji(content)) {
        return 'reacji'
      }
    }
    return 'reply'
  }
  if (post.properties['repost-of']) {
    return 'repost'
  }
  if (post.properties['bookmark-of']) {
    return 'bookmark'
  }
  if (post.properties['quotation-of']) {
    return 'quotation'
  }
  if (post.properties['like-of']) {
    return 'like'
  }
  if (post.properties.checkin) {
    return 'checkin'
  }
  if (post.properties['listen-of']) {
    return 'listen'
  }
  if (post.properties['read-of']) {
    return 'read'
  }
  if (post.properties.start) {
    return 'event'
  }
  if (
    post.properties['watch-of'] ||
    post.properties.show_name ||
    post.properties.movie_name
  ) {
    return 'watch'
  }
  if (post.properties.isbn) {
    return 'book'
  }
  if (post.properties.video) {
    return 'video'
  }
  if (post.properties.audio) {
    return 'audio'
  }
  if (post.properties.ate) {
    return 'ate'
  }
  if (post.properties.drank) {
    return 'drank'
  }
  if (post.children && Array.isArray(post.children)) {
    return 'collection'
  }
  if (post.properties.photo) {
    return 'photo'
  }
  if (post.properties.name && post.properties.name != '') {
    return 'article'
  }

  return 'note'
}