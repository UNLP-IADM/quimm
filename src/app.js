/**
 * Quimm App main file
 */

var snapper = new Snap({
    element: document.getElementById('content'),
    hyperextensible: false,
    disable: 'right'
});

function closeLeft()
{
    snapper.close();
}