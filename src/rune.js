var spaces
  = '                                '
  + '                                '

var charsByKeyCode = {
  13: ['\n', '\n'],
  32: [' ', ' '],

  48: ['0', ')'],
  49: ['1', '!'],
  50: ['2', '@'],
  51: ['3', '#'],
  52: ['4', '$'],
  53: ['5', '%'],
  54: ['6', '^'],
  55: ['7', '&'],
  56: ['8', '*'],
  57: ['9', '('],

  65: ['a', 'A'],
  66: ['b', 'B'],
  67: ['c', 'C'],
  68: ['d', 'D'],
  69: ['e', 'E'],
  70: ['f', 'F'],
  71: ['g', 'G'],
  72: ['h', 'H'],
  73: ['i', 'I'],
  74: ['j', 'J'],
  75: ['k', 'K'],
  76: ['l', 'L'],
  77: ['m', 'M'],
  78: ['n', 'N'],
  79: ['o', 'O'],
  80: ['p', 'P'],
  81: ['q', 'Q'],
  82: ['r', 'R'],
  83: ['s', 'S'],
  84: ['t', 'T'],
  85: ['u', 'U'],
  86: ['v', 'V'],
  87: ['w', 'W'],
  88: ['x', 'X'],
  89: ['y', 'Y'],
  90: ['z', 'Z'],

  186: [';', ':'],
  187: ['=', '+'],
  188: [',', '<'],
  189: ['-', '_'],
  190: ['.', '>'],
  191: ['/', '?'],
  192: ['`', '~'],

  219: ['[', '{'],
  220: ['\\', '|'],
  221: [']', '}'],
  222: ["'", '"'],
}

function char(keyCode, shift) {
  var chars = charsByKeyCode[keyCode]
  if (!chars) return ''
  return shift ? chars[1] : chars[0]
}

function editor(state) {
  var shift = false
  var lastKeyPressed = null
  var mode = 'edit'
  var editSession = Editor('')

  state.collate = function(state) {
    var s = StringWithMetadata(editSession.getText())

    s.tag(editSession.getSelectionStart(), 'start')
    s.tag(editSession.getSelectionEnd(), 'end')

    return {
      lines: s.split(/\n/),
      lastKey: lastKeyPressed,
      mode: mode
    }
  }

  state.display = displayEditor

  state.onKeyDown = function(event) {
    lastKeyPressed = event.key
    var typed = char(event.key, shift)

    if (16 === event.key) {
      shift = true
      return
    }

    if (mode === 'edit') {
      if (8 === event.key) {
        // backspace
        editSession.backspace()
      }

      if (typed === ';') {
        mode = 'semicolon'
      } else {
        editSession.replaceSelection(typed)
      }
      return
    }

    if (mode === 'semicolon') {
      if (typed === ' ' || typed === '\n') {
        editSession.replaceSelection(';' + typed)
        mode = 'edit'
        return
      } else if (typed === ';') {
        editSession.replaceSelection(';')
        mode = 'edit'
        return
      } else {
        mode = 'command'
      }
    }

    if ('J'.charCodeAt(0) === event.key) {
      if (shift) {
        editSession.selectLeft()
      } else {
        editSession.moveLeft()
      }
    } else if ('L'.charCodeAt(0) === event.key) {
      if (shift) {
        editSession.selectRight()
      } else {
        editSession.moveRight()
      }
    } else if ('I'.charCodeAt(0) === event.key) {
      editSession.moveUp()
    } else if ('K'.charCodeAt(0) === event.key) {
      editSession.moveDown()
    } else if (32 === event.key) {
      //spacebar
      mode = 'edit'
    }
  }

  state.onKeyUp = function(event) {
    if (16 === event.key) {
      shift = false
    }
  }
}

function displayEditor(data) {
  var selectionStart = null
  var selectionEnd = null
  var inSelection = false

  var header = LineBuffer(
    'last key: ' + data.lastKey
    + ' mode: ' + data.mode, {fg: 'goldenrod'})

  var styledLines = data.lines.map(function(line) {
    var foundStart = false
    var foundEnd = false
    var lineString = line.toString()

    line.eachTag(function(tag, pos) {
      if (tag === 'start') {
        selectionStart = pos
        foundStart = true
        inSelection = true
      } else if (tag === 'end') {
        foundEnd = true
        selectionEnd = pos
        inSelection = false
      }
    })

    if (foundStart && foundEnd) {
      var selectedPortion = lineString.slice(selectionStart, selectionEnd)
      var highlight = {bg: 'blue'}
      if (selectionStart === selectionEnd) {
        selectedPortion = (lineString + ' ').slice(selectionStart, selectionStart + 1)
        highlight = {bg: 'dimgray'}
      }
      return LineBuffer(lineString).paste(selectedPortion, selectionStart, highlight)
    } else if (foundStart) {
      var selectedPortion = lineString.slice(selectionStart)
      return LineBuffer(lineString).paste(selectedPortion + spaces, selectionStart, {bg: 'blue'})
    } else if (foundEnd) {
      var selectedPortion = lineString.slice(0, selectionEnd)
      return LineBuffer(lineString).paste(selectedPortion, 0, {bg: 'blue'})
    } else if (inSelection) {
      return LineBuffer(lineString, {bg: 'blue'})
    } else {
      return lineString
    }
  })

  return [header].concat(styledLines)
}

var state = {
  buffer: "foo\nbarbaz",
}

function main(event, data) {
  if (event.type === 'startup') {
    editor(state)
  }

  if (event.type === 'keyDown') {
    state.onKeyDown(event)
  }

  if (event.type === 'keyUp') {
    state.onKeyUp(event)
  }

  return state.display(state.collate(state))
}
