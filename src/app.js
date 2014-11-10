/**
 * Quimm App main file
 */

var snapper = new Snap({
  element: document.getElementById('content'),
  hyperextensible: false
});

function closeSnap() {
  snapper.close();
}

// Final
console.log('App iniciada');
