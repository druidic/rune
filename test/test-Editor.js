
describe('Editor', function() {
  function insertAt(index, toInsert, container) {
    return container.slice(0, index) + toInsert + container.slice(index)
  }

  function showCursor(editor) {
    var text = editor.getText()
    text = insertAt(editor.getSelectionEnd(), '<', text)
    text = insertAt(editor.getSelectionStart(), '>', text)
    return text
  }

  it('displays a buffer of text', function() {
    expect(Editor('foo').getText()).toEqual('foo')
  })

  it('has a cursor', function() {
    var editor = Editor('foo\nbar')
    expect(showCursor(editor)).toBe('><foo\nbar')
  })

  it('moves the cursor to the right', function() {
    var editor = Editor('foo\nbar')
    expect(showCursor(editor.moveRight())).toBe('f><oo\nbar')
  })

  it('moves the cursor to the left', function() {
    var editor = Editor('foo\nbar').moveRight()
    expect(showCursor(editor.moveLeft())).toBe('><foo\nbar')
  })

  it('does not move the cursor to a negative index', function() {
    var editor = Editor('foo\nbar').moveLeft()
    expect(editor.getSelectionStart()).toBe(0)
    expect(editor.getSelectionEnd()).toBe(0)
  })

  it('does not move the cursor beyond the end of the buffer', function() {
    var editor = Editor('').moveRight()
    expect(editor.getSelectionStart()).toBe(0)
    expect(editor.getSelectionEnd()).toBe(0)
  })

  it('moves the cursor down in the first column', function() {
    var editor = Editor('foo\nbarbaz\nkludge')
    expect(showCursor(editor.moveDown()))
      .toBe('foo\n><barbaz\nkludge')

    expect(showCursor(editor.moveDown()))
      .toBe('foo\nbarbaz\n><kludge')
  })

  it('moves the cursor to the end of the buffer when moving down on the last line', function() {
    var editor = Editor('foo')
    expect(showCursor(editor.moveDown()))
      .toBe('foo><')
  })

  it('moves down on a nonfirst column', function() {
    var editor = Editor('foo\nbarbaz\na\nbc')
      .moveRight()
      .moveRight()
      .moveDown()

    expect(showCursor(editor))
      .toBe('foo\nba><rbaz\na\nbc')

    editor.moveDown()

    expect(showCursor(editor))
      .toBe('foo\nbarbaz\na><\nbc')

    editor.moveDown()

    expect(showCursor(editor))
      .toBe('foo\nbarbaz\na\nb><c')
  })

  it('moves the cursor up', function() {
    var editor = Editor('foo\nbarbaz\nkludge')
      .moveDown()
      .moveDown()
      .moveUp()

    expect(showCursor(editor))
      .toBe('foo\n><barbaz\nkludge')
  })

  it('moves the cursor to the beginning of the buffer when moving up on the first line', function() {
    var editor = Editor('foo\nbar')
      .moveRight()
      .moveUp()

    expect(showCursor(editor))
      .toBe('><foo\nbar')
  })

  it('moves the cursor up on a nonfirst column', function() {
    var editor = Editor('foo\na\nbc')
      .moveDown()
      .moveDown()
      .moveRight()
      .moveRight()
      .moveUp()

    expect(showCursor(editor))
      .toBe('foo\na><\nbc')

    editor.moveUp()

    expect(showCursor(editor))
      .toBe('f><oo\na\nbc')
  })

  it('inserts one character at the cursor', function() {
    var editor = Editor('13')
      .moveRight()
      .replaceSelection('2')

    expect(showCursor(editor)).toBe('12><3')
  })

  it('inserts multiple characters at the cursor', function() {
    var editor = Editor('15')
      .moveRight()
      .replaceSelection('234')

    expect(showCursor(editor)).toBe('1234><5')
  })

  it('selects text to the right', function() {
    var editor = Editor('12')
      .selectRight()

    expect(showCursor(editor)).toBe('>1<2')
  })

  it('selects text to the left', function() {
    var editor = Editor('12')
      .moveRight()
      .selectLeft()

    expect(showCursor(editor)).toBe('>1<2')
  })

  it('replaces selected text', function() {
    var editor = Editor('12')
      .moveRight()
      .selectLeft()
      .replaceSelection('a')

    expect(showCursor(editor)).toBe('a><2')

    editor.selectRight()
      .replaceSelection('b')

    expect(showCursor(editor)).toBe('ab><')
  })

  it('backspaces over one character', function() {
    var editor = Editor('123')
      .moveRight()
      .moveRight()
      .backspace()

    expect(showCursor(editor)).toBe('1><3')
  })

  it('does nothing when backspacing at the beginning of the buffer', function() {
    var editor = Editor('123')
      .backspace()

    expect(showCursor(editor)).toBe('><123')
  })
})
