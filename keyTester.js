// Install this on a Grove to see key codes and
// test rollover for your keyboard

var keysHeld = {}

function main(event) {
  if (event.type === 'keyDown') {
    keysHeld[event.key] = true
  }

  if (event.type === 'keyUp') {
    delete keysHeld[event.key]
  }

  return 'Keys held: ' + formattedKeys()
}

function formattedKeys() {
  var keys = Object.keys(keysHeld)
  return keys.length ? keys.join(', ') : 'none'
}
