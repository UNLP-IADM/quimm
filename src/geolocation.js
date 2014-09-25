var Geolocation = (function () {

  // Geolocation initialization
  var currentPosition = null
    , updatePosition = function( geolocation ) {
        geolocation.getCurrentPosition( function( position ) {
          currentPosition = [ position.coords.latitude, position.coords.longitude ];
        });
      }
    , init = (function init () {
        var geolocation = navigator.geolocation
        if ( !geolocation ) {
          throw "Geolocation not supported";
        }

       // Get the current location as first instance
       updatePosition( geolocation );
     })();


  // Public API:
  // + currentPosition: returns an array whose content
  // is the latitude and longitude coordinates (in that order)
  // + updatePosition: updates the current position. NOTICE:
  // this update is not inmediately
  return {
    currentPosition: function () {
      return currentPosition;
    },
    updatePosition: function () {
      updatePosition( geolocation );
    }
  };

})();
