var ConexionBackend = (function( Ar ) {

  var _conn = null;

  var _iniciar = function( opciones ) {

    // Verificar parámetros
    opciones = opciones || {};
    opciones.url = 'quimm-backend-1-166446.sae1.nitrousbox.com';
    opciones.puerto = opciones.puerto || '3000';
    opciones.suscripciones = opciones.suscripciones ||
      [ [ 'todosLosSucesos' ] ]
    opciones.onConnection = opciones.onConnection || function(){};

    var addr = opciones.url + ':' + opciones.puerto;

    // Iniciar conexión con el backend
    _conn = new Ar( "quimm-backend.meteor.com" );

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

  var _actualizar = function(nomColeccion, id, query) {
    if ( !_conn) {
      throw 'No hay conexión con el backend';
    }

    var coleccion = _conn.getCollection(nomColeccion);
    return coleccion.update(id, query);
  }

  return {
    estado: function() {
      return _conn ? 'activa' : 'desactiva'
    },
    iniciar: _iniciar,
    cerrar:  _cerrar,
    sucesos: function(callback) {
      return _consultaReactiva('sucesos', {}).on('change', function(s_id) {
        var suceso = _consultaReactiva('sucesos', { _id: s_id }).result[0];
        return callback(suceso);
      });
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
        confirmacion: objeto.confirmacion
      });
    },
    /* AVISO: Estas funciones asumen el hecho de que
     * las confirmaciones ya fueron actualizadas localmente.
     * Se intento usar un $inc y un $dec en ambas, pero no se
     * pudo porque Asteroid es muy limitado para hacer consultas:
     * Ver: https://github.com/mondora/asteroid/issues/31
     */
    confirmarSuceso: function(objeto) {
      return _actualizar('sucesos', objeto.id, { confirmacion: objeto.confirmacion });
    },
    desmentirSuceso: function(objeto) {
      return _actualizar('sucesos', objeto.id, { confirmacion: objeto.confirmacion });
    }
  }

})( Asteroid )
