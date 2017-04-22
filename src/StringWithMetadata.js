function StringWithMetadata(string) {
  var tags = {}
  var self

  return self = {
    getString: getString,
    toString: getString,
    tag: tag,
    tagsAt: tagsAt,
    eachTag: eachTag,
    slice: slice,
    split: split,
    concat: concat
  }

  function getString() {
    return string
  }

  function tag(index, tag) {
    tags[index] = tags[index] || []
    tags[index].push(tag)
  }

  function tagsAt(index) {
    return tags[index] || []
  }

  function slice(start, end) {
    var sliced = StringWithMetadata(string.slice.apply(string, arguments))
    if (typeof end === 'undefined') {
      end = Infinity
    }

    var sliceWillBeNoOp = start <= 0 && end >= string.length
    if (sliceWillBeNoOp) {
      return self
    }

    eachTag(function(tag, pos) {
      if (pos >= start && pos <= end) {
        sliced.tag(pos - start, tag)
      }
    })

    return sliced
  }

  function split(delimiter) {
    var parts = []
    var match
    var remaining = string
    var traversed = 0

    while (match = delimiter.exec(remaining)) {
      parts.push(self.slice(traversed, traversed + match.index))
      remaining = remaining.slice(match.index + match[0].length)
      traversed += match.index + match[0].length
    }
    parts.push(self.slice(traversed))

    return parts
  }

  function concat(other) {
    var result = StringWithMetadata(string + other)

    eachTag(function(tag, t) {
      result.tag(t, tag)
    })

    if (other.eachTag) {
      other.eachTag(function(tag, t) {
        result.tag(string.length + t, tag)
      })
    }

    return result
  }

  function eachTag(fn) {
    for (var pos in tags) {
      if (tags.hasOwnProperty(pos)) {
        tags[pos].forEach(function(tag) {
          fn(tag, parseInt(pos))
        })
      }
    }
  }
}
