var modelo = (function () {

    var map = L.map('map', {
        doubleClickZoom: false
    });

    var markers = new Array();
    var ultimoMark;
		var miLat;
		var miLng;

    cargarMapaPrivada = function () {
        //var map = L.map('map').setView([-34.532, -58.53], 12);

        //centra el mapa donde estas ubicado
        map.locate({setView: true, maxZoom: 16});
        L.tileLayer('http://{s}.tiles.mapbox.com/v3/federicoruf.jl3l85oh/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(map);

        var marker = L.marker([-34.9343485,-57.9402335]).on('click', onClick);
        function onClick(e) {
            snapper.open('right');
        }
        marker.addTo(map)

        map.on('locationfound', onLocationFound);
        map.on('dblclick', onMapDoubleClick);
    }

    //función que retorna la posición actual donde se esta posicionado y creo un punto en esta
    onLocationFound = function (e) {
        console.log(e.latlng.lng);
				miLat=e.latlng.lng;
				miLng=e.latlng.lat;
        console.log(e.latlng.lat);
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();
        L.circle(e.latlng, radius).addTo(map);
    }

    //en este método se debería cargar/abrir una pantalla donde se muestre el formulario
    onMapDoubleClick = function (e) {

        snapper.open('left');
        console.log('Agregamos el evento');
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
})();
