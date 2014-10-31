var modelo = (function ($) {
	var
		map,
		markers,
		ultimoMark,
		
		//me guardo la latitud y longitud de cuando hago doble click para crear 
		//el objeto Marcador despues
		miLat,
		miLng,
		tempLatLng,
		
		//para el manejo de los marcadores
		iconos,
		goodIcon,
		neutraIcon,
		badIcon;

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
		
  cargarMapaPrivada = function () {
		//var map = L.map('map').setView([-34.532, -58.53], 12);

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
  }

  //función que retorna la posición actual donde se esta posicionado y creo un punto en esta
  onLocationFound = function (e) {
    console.log(e.latlng.lng);
		miLat=e.latlng.lng;
		miLng=e.latlng.lat;
    console.log(e.latlng.lat);
    var radius = e.accuracy / 2;
      L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
      L.circle(e.latlng, radius).addTo(map);
    }

    //en este método se debería cargar/abrir una pantalla donde se muestre el formulario
    onMapDoubleClick = function (e) {
      snapper.open('left');
      console.log('Agregamos el evento');
	  tempLatLng=e.latlng;
	  
	  $("#titulo-marcador").val("");
	  $("#descripcion-marcador").val("");
	}
	/*document.getElementById("textoMarkerDivId").className = "";
	 document.getElementById("textoMarkerId").value = "";
	 markers[e.latlng] = (L.marker(e.latlng).addTo(map));
	 ultimoMark = markers[e.latlng];
	 markers[e.latlng].on('dblclick', function(e){
	 document.getElementById("textoMarkerDivId").className = "";
	 document.getElementById("textoMarkerId").value = "";
	 console.log(markers[e.latlng]);
	 ultimoMark = markers[e.latlng];
	 });*/


	//-----------------PARA ELIMINAR, ES DE PRUBA PARA VER COMO SE VEN LOS ÍCONOS
	//en este método se debería cargar/abrir una pantalla donde se muestre el formulario
	/*onMapClick = function(e){
		//alert("clickaste en " + e.latlng);
		//document.getElementById("textoMarkerDivId").className = "";
		//document.getElementById("textoMarkerId").value = "";
		markers[e.latlng] = L.marker([e.latlng.lat, e.latlng.lng], {icon: neutralIcon}).addTo(map);
		ultimoMark = markers[e.latlng];
		markers[e.latlng].on('dblclick', function(e){
			document.getElementById("textoMarkerDivId").className = "";
			document.getElementById("textoMarkerId").value = "";
			console.log(markers[e.latlng]);
			ultimoMark = markers[e.latlng];
		});
		L.marker([e.latlng.lat, e.latlng.lng], {icon: neutralIcon}).addTo(map);
	}*/
	//-----------------
		
	//formatea el texto a mostrar en el snapper de la derecha
	onclickMarker = function(e){
		snapper.open('right');
		marker = markers[e.latlng];
		
		document.getElementById("descripcion").innerHTML = "<h3>Datos de marcador: "
		+e.latlng+"</h3>"+"<h4>Titulo: "+marker.title+"</h4><br/><h4>Descripcion: "
		+marker.description+"</h4><br/><h4> Categoria: "+marker.category+"</h4>";		
	}
	
	guardarMarcador = function () {		
		var categoria = $("#select-marcador").val();
		//lo hacemos así porque icon: pide el nombre de la variable
		if(categoria == "goodIcon"){
			var markerLeaflet = L.marker([tempLatLng.lat,tempLatLng.lng], {icon: goodIcon}).addTo(map);			
  	    }else{
			if(categoria == "neutralIcon"){
				var markerLeaflet = L.marker([tempLatLng.lat,tempLatLng.lng], {icon: neutralIcon}).addTo(map);		
			}else{
				var markerLeaflet = L.marker([tempLatLng.lat,tempLatLng.lng], {icon: badIcon}).addTo(map);		
			}
		}
		markerLeaflet.on('click', onclickMarker);
		
		var marker = new MarkerObject(
		$("#titulo-marcador").val(),
		$("#descripcion-marcador").val(),		
		$("#select-marcador").val(),
		tempLatLng.lat,
		tempLatLng.lng,
		markerLeaflet);
		
		markers[tempLatLng] = marker;		
		
		//markers[tempLatLng].bindPopup('<strong>'+titulo+'</strong><br/>'+descripcion);
		snapper.close();
	}
	
  saveMarkerText = function () {
		console.log("BOTON!");
    document.getElementById("textoMarkerDivId").className = "hidden";
    ultimoMark.bindPopup(document.getElementById("textoMarkerId").value);
  }
		
	irAMiPosicionPrivada = function(){		
		console.log(miLat);
		map.setView(new L.LatLng(miLng, miLat), 16);
	}

  return{
    cargarMapa: cargarMapaPrivada,
    saveText: saveMarkerText,
		irAMiPosicion: irAMiPosicionPrivada
  }
})(jQuery);
