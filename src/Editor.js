function Editor(text) {
  var self
  var cursor = 0, anchor = 0

  return self = {
    getText: getText,
    moveRight: moveRight,
    moveLeft: moveLeft,
    moveDown: moveDown,
    moveUp: moveUp,
    selectRight: selectRight,
    selectLeft: selectLeft,
    getSelectionEnd: getSelectionEnd,
    getSelectionStart: getSelectionStart,
    replaceSelection: replaceSelection,
    backspace: backspace
  }

  function getText() {
    return text
  }

  function moveRight() {
    selectRight()
    anchor = cursor
    return self
  }

  function moveLeft() {
    selectLeft()
    anchor = cursor
    return self
  }

  function moveDown() {
    if (onLastLine()) {
      cursor = text.length
    } else if (nextLineLength() < cursorColumn()) {
      cursor = nextLineEnd()
    } else {
      cursor = nextLineStart() + cursorColumn()
    }
    anchor = cursor
    return self
  }

  function moveUp() {
    if (onFirstLine()) {
      cursor = 0
    } else if (previousLineLength() < cursorColumn()) {
      cursor = previousLineEnd()
    } else {
      cursor = previousLineStart() + cursorColumn()
    }
    anchor = cursor
    return self
  }

  function selectRight() {
    cursor++
    if (cursor > text.length) {
      cursor = text.length
    }
    return self
  }

  function selectLeft() {
    cursor--
    if (cursor < 0) {
      cursor = 0
    }
    return self
  }

  function getSelectionEnd() {
    return Math.max(anchor, cursor)
  }

  function getSelectionStart() {
    return Math.min(anchor, cursor)
  }

  function replaceSelection(toInsert) {
    text
      = text.slice(0, getSelectionStart())
      + toInsert
      + text.slice(getSelectionEnd())

    cursor = getSelectionStart() + toInsert.length
    anchor = cursor

    return self
  }

  // --- Private methods -----------------------------

  function currentLineStart() {
    // this magically handles the case where the cursor is on the first
    // line because lastIndexOf returns -1 if no match is found
    return text.lastIndexOf('\n', cursor - 1) + 1
  }

  function previousLineStart() {
    return text.lastIndexOf('\n', currentLineStart() - 2) + 1
  }

  function nextLineStart() {
    return text.indexOf('\n', currentLineStart()) + 1
  }

  function previousLineEnd() {
    return currentLineStart() - 1
  }

  function nextLineEnd() {
    var end = text.indexOf('\n', nextLineStart())
    if (end === -1) {
      return text.length
    }
    return end
  }

  function nextLineLength() {
    return nextLineEnd() - nextLineStart()
  }

  function previousLineLength() {
    return previousLineEnd() - previousLineStart()
  }

  function cursorColumn() {
    return cursor - currentLineStart()
  }

  function onLastLine() {
    return !nextLineStart()
  }

  function onFirstLine() {
    return currentLineStart() === 0
  }

  function backspace() {
    selectLeft()
    replaceSelection('')
    return self
  }
}
