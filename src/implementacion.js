var modelo = (function () {
  var map, markers, marcadorActual,

  //me guardo la latitud y longitud de cuando hago doble click
  //para crear el objeto Marcador despues
  miLat, miLng, tempLatLng,

  //para el manejo de los marcadores
  iconos, goodIcon, neutraIcon, badIcon;
  
  //para el manejo de 

  map = L.map('map', {
    doubleClickZoom: false
  });

  markers = new Array();
  iconos = L.Icon.extend({
    options: {
      iconSize:     [43, 50], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 22], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-2, -13] // point from which the popup should open relative to the iconAnchor
    }
  });
  goodIcon = new iconos({iconUrl: 'imagenes/flag-export.png'});
  neutralIcon = new iconos({iconUrl: 'imagenes/smiley_neutral.png'});
  badIcon = new iconos({iconUrl: 'imagenes/caution.png'});

  cargarPuntosGuardados = function() {
    var puntos = ConexionBackend.sucesos();
    for (var i=0; i < puntos.length; i++) {
      var pos = puntos[i].ubicacion.coordinates;
      markers.push(L.marker([pos[1], pos[0]], {icon: puntos[i].categoria}))
    }
  }

  cargarMapaPrivada = function () {
    //centra el mapa donde estas ubicado
    map.locate({setView: true, maxZoom: 16});
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/federicoruf.jl3l85oh/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(map);

    map.on('locationfound', onLocationFound);
    map.on('dblclick', onMapDoubleClick);
    //-----------------
    //map.on('click',onMapClick);
    //-----------------
    // Inicia la conexión con el backend junto a una
    // suscripción a sucesos locales (cuando el geolocalizador esté listo)
    Geolocation.onCurrentPosition( function( currentPosition ) {
      //ConexionBackend.iniciar( { suscripciones: [ [ 'sucesosSegunUbicacion', currentPosition, 10000 ] ] } );
      ConexionBackend.iniciar( { suscripciones: [ [ 'todosLosSucesos' ] ], onConnection: cargarPuntosGuardados } );
    });
  }

  // en este método se debería cargar/abrir una pantalla
  // donde se muestre el formulario
  crearSuceso = function (e) {
    snapper.open('left');
    console.log('Agregamos el evento');
    tempLatLng=e.latlng;

    document.getElementById("titulo-marcador").value = "";
    document.getElementById("descripcion-marcador").value = "";
  }

  // Muestra la información del suceso
  // formatea el texto a mostrar en el snapper de la derecha
  mostrarSuceso = function (e){
    snapper.open('right');
    marker = markers[e.latlng];
	//lo necesito para los metodos de confirmar o desmentir
	marcadorActual = marker;
	
    document.getElementById("d-titulo-marcador").innerHTML = marker.title;
    document.getElementById("d-descripcion-marcador").innerHTML = marker.description;
    if(marker.category == "goodIcon"){
      document.getElementById("d-categoria-marcador").innerHTML = "Evento bueno";
    }else{
      if(marker.category == "badIcon"){
        document.getElementById("d-categoria-marcador").innerHTML = "Evento malo";
      }else{
        document.getElementById("d-categoria-marcador").innerHTML = "Evento neutral";
      }
    }
  }


  //función que retorna la posición actual donde se esta posicionado y creo un punto en esta
  onLocationFound = function (e) {
    console.log(e.latlng.lng);
    miLat=e.latlng.lng;
    miLng=e.latlng.lat;
    console.log(e.latlng.lat);
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(map).bindPopup("Estás a aprox. " + radius + " metros de este punto.").openPopup();
    L.circle(e.latlng, radius).addTo(map);
  }

  // Asociaciones de eventos con funciones del modelo:
  onMapDoubleClick = crearSuceso;
  onclickMarker = mostrarSuceso;

  guardarMarcador = function () {
    var categoria = document.getElementById("select-marcador").value;
    //lo hacemos así porque icon: pide el nombre de la variable
    var markerLeaflet = L.marker([tempLatLng.lat,tempLatLng.lng], {icon: neutralIcon}).addTo(map);
	
    markerLeaflet.on('click', onclickMarker);

    var marker = new MarkerObject(
        document.getElementById("titulo-marcador").value,
        document.getElementById("descripcion-marcador").value,
        document.getElementById("select-marcador").value,
        tempLatLng.lat,
        tempLatLng.lng,
        markerLeaflet);
	
    markers[tempLatLng] = marker;
	//actualizamos la barra de estado general de los eventos de acuerdo a si
	//es bueno, neutral o malo.	
	updateBarraDeEstado(marker.category);
	
    var d = ConexionBackend.guardarSuceso(marker);
    console.log(d);

    //markers[tempLatLng].bindPopup('<strong>'+titulo+'</strong><br/>'+descripcion);
    snapper.close();
  }

  updateBarraDeEstado = function(){
	var good = 0;
	var bad = 0;
	var neutral = 0;	
	for(m in markers) {
		var elem = markers[m];
		if(elem.category == "goodIcon"){good++;}
		else{
			if(elem.category == "badIcon"){bad++;}
			else{neutral++;}
		}
	}
	var barra = document.getElementById("barraDeEstado");
	if(good>bad & good>neutral){//pintamos la barra de verde		
		barra.style.background  = "green";		
	}
	else{
		if(bad>good & bad>neutral){//pintamos la barra de rojo		
			barra.style.background  = "red";			
		}
		else{			
			//pintamos la barra de amarillo		
			barra.style.background  = "yellow";			
		}
	}
	console.log("bueno "+good+" malo "+bad+" neutral "+neutral);
  }
  
  irAMiPosicionPrivada = function(){
    console.log(miLat);
    map.setView(new L.LatLng(miLng, miLat), 16);
  }
  
  confirmarEvento = function(){
	marcadorActual.confirmacion += 1;
	console.log("confirmacion: "+marcadorActual.confirmacion);
	if(marcadorActual.confirmacion >= 1){
		marcadorActual.markerLeaflet.setIcon(goodIcon);
	}
  }
  
  desmentirEvento = function(){
	marcadorActual.confirmacion -= 1;
	console.log("confirmacion: "+marcadorActual.confirmacion);
	if(marcadorActual.confirmacion <= 0){
		marcadorActual.markerLeaflet.setIcon(badIcon);
	}
  }

  return{
    cargarMapa: cargarMapaPrivada,
    irAMiPosicion: irAMiPosicionPrivada,	
    cargarPuntosGuardados: cargarPuntosGuardados
  }
})();
