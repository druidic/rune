# Rune

Rune is a text editor for the MOSS operating system. It is
inspired by Vim and [Kakoune](http://kakoune.org/), but has
its own idea of how to do things.

It will ship with MOSS.

Currently it runs standalone on a Grove.

## Installation

Run `./build.sh`. This copies all the code to your
clipboard. Paste into the `startup` record of a
[Grove](https://github.com/druidic/grove). Restart the
Grove to launch the editor.

## General Concepts

Rune treats text documents as simple lists of characters—
just one byte after another. A document loaded into Rune's
memory (or created there) is called the **buffer**.

Rune has a concept of a **selection**, which is a slice of
the buffer. A selection has two ends, the **anchor** and the
**cursor**. The cursor is the end that moves around when you
issue movement commands. The anchor stays put. The anchor
and cursor both represent positions in between characters.

The anchor and cursor may be at the same position, in which
case no characters are selected.

## Movement commands

### Grid movement

The i, j, k, and l keys act like arrow keys. They move
the cursor and anchor around one character or line at a
time.

Holding shift while pressing the movement keys causes the
cursor to move while the anchor stays put, effectively
expanding or contracting the selection by one character or
line.

### Word movement

Holding the d key while moving horizontally with j and l
moves word-by-word.

Holding the d key while moving vertically with i and k
moves paragraph-by-paragraph. (A paragraph is considered
to be a block of text separated from adjacent paragraphs
by a blank line.)

Holding shift while moving in this way
expands or contracts the selection.

## Editing Text

Pressing the spacebar when in command mode goes into
**edit mode**. While in edit mode, you can type normally
to insert characters.

To get out of edit mode, press the semicolon key.
This puts the editor into "semicolon mode", a sort of
limbo between the edit and command modes. At this point,
if you type a space, newline,
or semicolon, you will remain in insert mode and a literal
semicolon will be inserted. If you press any other
key, you will leave insert mode and no semicolon will be
inserted.

## Key Differences from Vim

There is no separate visual mode—to select text, you hold
`shift` while pressing movement keys.

To get out of insert mode, you press semicolon rather than
escape.
