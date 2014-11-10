var Geolocation = (function () {

  var geolocation = null
  // Geolocation initialization
  var currentPosition = null
    , updatePosition = function( geolocation ) {
        geolocation.getCurrentPosition( function( position ) {
          currentPosition = [ position.coords.longitude, position.coords.latitude ];
          console.log('Geolocalizador: Posición actualizada');
        });
      }
    , init = (function init () {
        geolocation = navigator.geolocation
        if ( !geolocation ) {
          throw "Geolocation not supported";
        }

       // Get the current location as first instance
       updatePosition( geolocation );
     })();


  // Public API:
  // + currentPosition: returns an array whose content
  // is the longitude and latitude coordinates (in that order)
  // + updatePosition: updates the current position. NOTICE:
  // this update is not inmediately
  // + onCurrentPosition: uses a callback function to be executed
  // when a new position is requested and resolved.
  return {
    currentPosition: function () {
      return currentPosition;
    },
    updatePosition: function () {
      updatePosition( geolocation );
    },
    onCurrentPosition: function( fun ) {
      geolocation.getCurrentPosition( function(position) {
        var currentPosition = [ position.coords.longitude, position.coords.latitude ];
        fun( currentPosition );
      });
    }
  };

})();
