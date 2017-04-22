## In-editor help

The first thing you probably want to know is how you're
going to remember all the stuff in this document! After you
use Rune for a while, these commands will be second nature,
but until then, you can get in-editor help by pressing the
? or / key. Note that if you are in **edit mode** (see
below), pressing this key will simply insert a ? or /
character, and you will have to leave edit mode to see
the help screen.

## Starting up

If you create a new file in the MOSS operating system, Rune
will launch and greet you with a blank document.

You can simply start typing to enter text. The backspace
key, return key, and shift will all work as you'd expect in
other operating systems.

However, certain keys will not have the effect you're used
to: the arrow keys, caps lock, and control/command/meta/alt
keys have no effect in Rune.

### Line movement

g goes to the end of the current line; a goes to the
beginning. Shift-g and shift-a select.

### Search movement

f and t work as in Vim. shift-F and shift-T select in
addition to moving.

s works like Vim's /.

## Editing Text

...  If the selection is not empty when you
enter insert mode, the selected text is deleted and moved
to the **kill ring**.

## Copying, cutting, and pasting

You can copy the selected text by pressing c.

v brings up the **paste menu**, which shows all the snippets
that have been copied to the kill ring. The kill ring is
stored on disk, so if you copy in one buffer you can paste
in another. Rune remembers your copy history even after you
reboot the computer!

If you're sure of what you last copied, shift-V simply
pastes the most recent item from the history.

## Leaving edit mode

If you press delete, the
"Semicolon" banner disappears—it's as if you never pressed
the semicolon key in the first place.
