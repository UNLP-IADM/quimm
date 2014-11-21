ConexionBackend = (function() {

  var _conn = null;

  var _iniciar = function( opciones ) {

    // Verificar parámetros
    opciones = opciones || {};
    opciones.url = opciones.url || 'localhost';
    opciones.puerto = opciones.puerto || '5000';
    opciones.suscripciones = opciones.suscripciones ||
      [ [ 'todosLosSucesos' ] ]
    opciones.onConnection = opciones.onConnection || function(){};

    var addr = opciones.url + ':' + opciones.puerto;

    // Iniciar conexión con el backend
    _conn = new Asteroid(addr);

    _conn.on('connected', function() {
      // Realizar suscripciones
      for (var i=0; i<opciones.suscripciones.length; i++) {
        _conn.subscribe.apply(_conn, opciones.suscripciones[i]);
      }
      opciones.onConnection();
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
    cambiosEnSucesos: function(callback) {
      return _consultaReactiva('sucesos', {}).on('change', function(s_id) {
        var suceso = _consultaReactiva('sucesos', { _id: s_id }).result[0];
        return callback(suceso);
      });
    },
    guardarSuceso: function(objeto) {
      return _insertar('sucesos', {
        nombre: objeto.title,
        descripcion: objeto.description,
        categoria: objeto.category,
        ubicacion: { type: 'Point', coordinates: [ objeto.lng, objeto.lat ] },
        confirmacion: objeto.confirmation
      });
    }
  }

})()
