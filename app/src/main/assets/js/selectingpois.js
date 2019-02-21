var World = {
    /* Variable para solicitar información */
	isRequestingData: false,
   /* Variable para determinar la primera recuperación de la información */
	initiallyLoadedData: false,
	/* Parámetros del marcador */
	markerDrawable_idle: null,
	markerDrawable_selected: null,
	markerDrawable_directionIndicator: null,

	/* Lista de objetos de Realidad Aumentada*/
	markerList: [],
	currentMarker: null,

    /* Inyección de los datos de los nuevos marcadores */
	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
        /* Se destruyen todos los objetos AR previos */
        AR.context.destroyAll();

        PoiRadar.show();
        $('#radarContainer').unbind('click');
        $("#radarContainer").click(PoiRadar.clickedRadar);

        /* Arreglo de marcados visibles */
	    World.markerList = [];

	    /* Cargar los recursos de los marcadores */
		World.markerDrawable_idle = new AR.ImageResource("assets/hidranteFinal.png");
		World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
		World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");

		/* Lazo para recorrer la información de los marcadores y crear los objetos de Realidad Aumentada */
		for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
			var singlePoi = {
				"id": poiData[currentPlaceNr].id,
				"latitude": parseFloat(poiData[currentPlaceNr].latitude),
				"longitude": parseFloat(poiData[currentPlaceNr].longitude),
				"altitude": parseFloat(poiData[currentPlaceNr].altitude),
				"title": poiData[currentPlaceNr].name,
				"description": poiData[currentPlaceNr].description
			};
			/* Mensaje con el número de hidrantes ubicados */
			World.markerList.push(new Marker(singlePoi));
		}
		World.updateStatusMessage(currentPlaceNr + ' places loaded');

	},

    updateDistanceToUserValues: function updateDistanceToUserValuesFn() {

        var newLocation = new AR.GeoLocation(latitude, longitude, altitude);
        var distanceUpdate = newLocation.distanceToUser();

        var distanceToUserValue = (marker.distanceToUser > 999) ?
                    ((marker.distanceToUser / 1000).toFixed(2) + " km") :
                    (Math.round(marker.distanceToUser) + " m");

        for (var i = 0; i < World.markerList.length; i++) {
            //World.markerList[i].distanceToUser = World.markerList[i].markerObject.locations[0].distanceToUser();
            var newLocation2 = World.markerList.n;
            var distanceUpdate2  = (newLocation2.distanceToUser > 999) ?
                        ((newLocation2.distanceToUser / 1000).toFixed(2) + " km") :
                        (Math.round(marker.distanceToUser) + " m");

            World.markerList.distanceLabel.text= distanceUpdate2;
        }
    },

    /* Actualiza el mensaje con el número de hidrantes ubicados */
	updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

		var themeToUse = isWarning ? "e" : "c";
		var iconToUse = isWarning ? "alert" : "info";

		$("#status-message").html(message);
		$("#popupInfoButton").buttonMarkup({
			theme: themeToUse
		});
		$("#popupInfoButton").buttonMarkup({
			icon: iconToUse
		});
	},

    /* Método invocado cada vez que existe una actualización en la ubicación del dispositivo*/
	locationChanged: function locationChangedFn(lat, lon, alt, acc) {

        //Variable que almacena la posición actual del usuario
	    World.userLocation = {
            'latitude': lat,
            'longitude': lon,
            'altitude': alt,
            'accuracy': acc
        };

        /* Se cargan los marcadores por primera vez y se setea en true la variable initiallyLoadedData para actualizar
        los marcadores posteriormente. */
		if (!World.initiallyLoadedData) {
		    console.log("LOAD");
			//World.requestDataFromLocal(lat, lon);
            //World.initiallyLoadedData = true;
            //World.closestPois(lat, lon);
            World.requestDataFromServer(lat, lon);
            World.initiallyLoadedData = true;


        }
        /* Actualización de la distancia a los hidrantes. */
        else {
                console.log("ACTUALIZANDO");
                //var userLocation = new AR.GeoLocation(lat, lon);
                //console.log(userLocation);
                for (i=0; i<World.markerList.length; i++){

                    var updateLocation = World.markerList[i].locationHolder;
                    var distanceUpdate = updateLocation.distanceToUser();
                    var distanceUpdate2String = "";
                    distanceUpdate2String = Math.round(distanceUpdate) + "ms";
                    World.markerList[i].distanceLabel.text = distanceUpdate2String;

                }

        }

	},

    /* Método invocado cuando se selecciona un marcador en pantalla */
	onMarkerSelected: function onMarkerSelectedFn(marker) {

	    /* Deselecciona el marcador previo */
		if (World.currentMarker) {
			if (World.currentMarker.poiData.id == marker.poiData.id) {
				return;
			}
			World.currentMarker.setDeselected(World.currentMarker);
		}
		/* Resalta el marcador seleccionado */
		marker.setSelected(marker);
		World.currentMarker = marker;

        /* Despliega una ventana con el nombre, descripción y distancia hacia el hidrante */
		$("#poi-detail-title").html(marker.poiData.title);
        $("#poi-detail-description").html(marker.poiData.description);

        if (undefined === marker.distanceToUser) {
            marker.distanceToUser = marker.markerObject.locations[0].distanceToUser();
        }

        var distanceToUserValue = (marker.distanceToUser > 999) ?
            ((marker.distanceToUser / 1000).toFixed(2) + " km") :
            (Math.round(marker.distanceToUser) + " m");

        $("#poi-detail-distance").html(distanceToUserValue);

        $("#panel-poidetail").panel("open", 123);

        $(".ui-panel-dismiss").unbind("mousedown");

        $("#panel-poidetail").on("panelbeforeclose", function(event, ui) {
            World.currentMarker.setDeselected(World.currentMarker);
        });
	},

    /* Método invocado cuando se da clic a la pantalla pero no se selecciona un marcador. */
	onScreenClick: function onScreenClickFn() {
		if (World.currentMarker) {
			World.currentMarker.setDeselected(World.currentMarker);
		}
	},

    /* Invocación del método que obtiene los datos del archivo JS local */
	requestDataFromLocal: function requestDataFromLocalFn(centerPointLatitude, centerPointLongitude) {
		//var poisToCreate = 15;
		//var poiData = [];
		//poiData = myJsonData.slice(0, poisToCreate);
		var poiData = [];
		poiData = myJsonData;
        World.loadPoisFromJsonData(poiData);
	},

	requestDataFromServer: function requestDataFromServerFn(lat, lon) {

        /* Set helper var to avoid requesting places while loading. */
        World.isRequestingData = true;
        World.updateStatusMessage('Requesting places from web-service');

        /* Server-url to JSON content provider. */
        var serverUrl = "https://servicios.bomberosquito.gob.ec:8181/Hidrantes/webresources/servicios.hidrantes/registro/?latitud=" +
            lat + "&longitud=" + lon;

        var jqxhr = $.getJSON(serverUrl, function(data) {
                World.loadPoisFromJsonData(data);
                console.log(data);
            })
            .error(function(err) {
                World.updateStatusMessage("Invalid web-service response.", true);
                World.isRequestingData = false;
            })
            .complete(function() {
                World.isRequestingData = false;
            });
    },

/*    recargarHidrantes: function recargarHidrantesFn (){
        if(!World.isRequestingData){
            if(World.userLocation){
                World.requestDataFromServer(World.userLocation.latitude, World.userLocation.longitude);
                console.log("Posicion Actualizada");
            }
            else{
                World.updateStatusMessage('Posición desconocida.',true);
            }
        }
        else{
            World.updateStatusMessage('Buscando posiciones...',true);
        }
    },*/

    /* Método invocado para actualizar los objetos AR en pantalla y radar */
    reloadPlaces: function reloadPlacesFn() {
        if (!World.isRequestingData) {
            if (World.userLocation) {
                World.requestDataFromServer(World.userLocation.latitude, World.userLocation.longitude);
            } else {
                World.updateStatusMessage('Unknown user-location.', true);
            }
        } else {
            World.updateStatusMessage('Already requesing places...', true);
        }
    },

	closestPois: function closestPoi(latitude, longitude){

	    var posicionActual = new AR.GeoLocation(latitude, longitude);
	    console.log(posicionActual);
	    var posicionesHidrantes = [];
	    var distanciasHaciaHidrantes = [];
	    var hidrantesCercanos = [];

        for (i=0; i<myJsonData.length; i++){
            //long = myJsonData[i]["longitude"];
            //lat = myJsonData[i]["latitude"];
            posicionesHidrantes [i] = new AR.GeoLocation(myJsonData[i]["latitude"],myJsonData[i]["longitude"]);
            //posicionesHidrantes [i] = new AR.GeoLocation(myData[i]["latitude"],myData[i]["longitude"]);
        }
        console.log(posicionesHidrantes);

        for (j=0; j<posicionesHidrantes.length; j++){
            //distanciasHaciaHidrantes [j] = posicionActual.distanceTo(posicionesHidrantes[j]);
            distanciasHaciaHidrantes[j] = Math.round(posicionesHidrantes[j].distanceTo(posicionActual));
        }
        console.log(distanciasHaciaHidrantes);

        for (i=0; i<distanciasHaciaHidrantes.length; i++){
            if (distanciasHaciaHidrantes[i]<100){
                    hidrantesCercanos.push({"distancia":distanciasHaciaHidrantes[i],"indice":i});
            }
        }
        console.log(hidrantesCercanos);

        for (i=0; i<hidrantesCercanos; i++){

        }

	}

};

/* Función a la que se reenvían los cambios de ubicación del dispositivo. */
AR.context.onLocationChanged = World.locationChanged;
AR.context.onScreenClick = World.onScreenClick;