describe('StringWithMetadata', function() {
  it('allows access to the underlying string', function() {
    var s = StringWithMetadata('foo')

    expect(s.getString()).toEqual('foo')
  })

  it('allows access to the metadata', function() {
    var s = StringWithMetadata('foo')

    s.tag(1, 'hello')

    expect(s.tagsAt(1)).toEqual(['hello'])
  })

  it('slices a string', function() {
    var s = StringWithMetadata('012345')

    expect(s.slice(0, 2).getString()).toEqual('01')
    expect(s.slice(3).getString()).toEqual('345')
  })

  it('keeps metadata when the string is sliced', function() {
    var s = StringWithMetadata('012345')
    s.tag(0, 'zero')
    s.tag(5, 'five')

    expect(s.slice(0, 2).tagsAt(0)).toEqual(['zero'])
    expect(s.slice(2).tagsAt(3)).toEqual(['five'])
    expect(s.slice(2, 3).tagsAt(3)).toEqual([])
  })

  it('splits a string', function() {
    var s = StringWithMetadata('012 456 890')
    expect(s.split(/ /)[0].getString()).toEqual('012')
    expect(s.split(/ /)[1].getString()).toEqual('456')
    expect(s.split(/ /)[2].getString()).toEqual('890')
  })

  it('returns itself when the split pattern is not matched', function() {
    var s = StringWithMetadata('012 456 890')
    expect(s.split(/not there/)[0]).toBe(s)
  })

  it('keeps metadata when the string is split', function() {
    var s = StringWithMetadata('012 456 890')

    s.tag(0, 'zero')
    s.tag(4, 'four')
    s.tag(10, 'ten')

    expect(s.split(/ /)[0].tagsAt(0)).toEqual(['zero'])
    expect(s.split(/ /)[1].tagsAt(0)).toEqual(['four'])
    expect(s.split(/ /)[2].tagsAt(2)).toEqual(['ten'])
  })

  it('preserves tags from the character after the split region', function() {
    var s = StringWithMetadata('012 456 890')

    s.tag(3, 'after')
    s.tag(11, 'after2')

    expect(s.split(/ /)[0].tagsAt(3)).toEqual(['after'])
    expect(s.split(/ /)[2].tagsAt(3)).toEqual(['after2'])
  })

  it('concatenates a plain JS string', function() {
    var s = StringWithMetadata('foo')
    expect(s.concat('bar').getString()).toBe('foobar')
  })

  it('keeps metadata when concatenating a plain JS string', function() {
    var s = StringWithMetadata('foo')
    s.tag(1, 'hello')
    expect(s.concat('bar').tagsAt(1)).toEqual(['hello'])
  })

  it('concatenates a StringWithMetadata', function() {
    var s = StringWithMetadata('foo')
    var added = StringWithMetadata('bar')

    expect(s.concat(added).getString()).toBe('foobar')
  })

  it('keeps metadata when concatenating a StringWithMetadata', function() {
    var s = StringWithMetadata('foo')
    var added = StringWithMetadata('bar')

    s.tag(1, 'hello')
    added.tag(0, 'from added')
    expect(s.concat(added).tagsAt(1)).toEqual(['hello'])
    expect(s.concat(added).tagsAt(3)).toEqual(['from added'])
  })
})
