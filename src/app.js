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

function loadScript(url) {
  // Adding the script tag to the head as suggested before
  var scriptsList = document.getElementById('scripts');
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  // Fire the loading
  scriptsList.appendChild(script);
}
