var modelo = (function (){
	
	var map= L.map('map');
	
	cargarMapaPrivada = function(){
		//var map = L.map('map').setView([-34.532, -58.53], 12);
		
		//centra el mapa donde estas ubicado
		map.locate({setView: true, maxZoom: 16});
		L.tileLayer('http://{s}.tiles.mapbox.com/v3/federicoruf.jl3l85oh/{z}/{x}/{y}.png', {
			maxZoom: 18
		}).addTo(map);
		
		//crear un punto  de prueba en el mapa (lo crea por vicente lopez)
		L.marker([-34.532, -58.53]).addTo(map)
			.bindPopup('version 3 popup. <br> Easily customizable.')
			.openPopup();
			
		map.on('locationfound', onLocationFound);
		map.on('locationerror', onLocationError);
		map.on('click',onMapClick);
	}

	//función que retorna la posición actual donde se esta posicionado y creo un punto en esta
	onLocationFound = function(e) {
		console.log(e.latlng.lng);
		console.log(e.latlng.lat);
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(map);
	}
	
	//es un menseje de error para cuando el gsp falla
	onLocationError = function(e) {
    alert("ERROR!!!!!");
	}
	
	//en este método se debería cargar/abrir una pantalla donde se muestre el formulario
	onMapClick = function(e){
		alert("clickaste en " + e.latlng);	
	}

	return{
		cargarMapa: cargarMapaPrivada,
	}
})();
