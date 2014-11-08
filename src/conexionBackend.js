ConexionBackend = (function() {

  // Cargar dependencias a usar: Asteroid
  loadScript("vendor/ddp.js/src/ddp.js");
  loadScript("vendor/q/q.js");
  loadScript("vendor/asteroid/dist/asteroid.browser.js");

  var _conn = null;

  var _iniciar = function( opciones ) {

    // Verificar parámetros
    opciones = opciones || {};
    opciones.url = opciones.url || 'localhost';
    opciones.puerto = opciones.puerto || '5000';
    opciones.suscripciones = opciones.suscripciones ||
      ['todosLosSucesos']

    var addr = opciones.url + ':' + opciones.puerto;

    // Iniciar conexión con el backend
    _conn = new Asteroid(addr);

    _conn.on('connected', function() {
      // Realizar suscripciones
      for (var i=0; i<opciones.suscripciones.length; i++)
        _conn.subscribe(opciones.suscripciones[i]);
    });

  };

  var _cerrar = function() { _conn = null; };

  var _consultaReactiva = function(nomColeccion, consulta) {
    if ( !_conn) {
      throw 'No hay conexión con el backend';
    }

    var coleccion = _conn.getCollection(nomColeccion);
    return coleccion.reactiveQuery(consulta);
  }

  var _insertar = function(nomColeccion, objeto) {
    if ( !_conn) {
      throw 'No hay conexión con el backend';
    }

    var coleccion = _conn.getCollection(nomColeccion);
    return coleccion.insert(objeto);
  }

  return {
    estado: function() {
      return _conn ? 'activa' : 'desactiva'
    },
    iniciar: _iniciar,
    cerrar:  _cerrar,
    sucesos: function() {
      return _consultaReactiva('sucesos', {}).result;
    },
    guardarSuceso: function(objeto) {
      return _insertar('sucesos', {
        title: objeto.title,
        description: objeto.category,
        lat: objeto.lat,
        lng: objeto.lng
      });
    }
  }

})()
