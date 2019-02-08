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

        /* Se cargan los marcadores por primera vez y se setea en true la variable initiallyLoadedData para actualizar
        los marcadores posteriormente. */
		if (!World.initiallyLoadedData) {
		    console.log("LOAD");
			World.requestDataFromLocal(lat, lon);
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
		var poisToCreate = 20;
		var poiData = [];
		poiData = myJsonData;
        World.loadPoisFromJsonData(myJsonData);
	}
};

/* Función a la que se reenvían los cambios de ubicación del dispositovo. */
AR.context.onLocationChanged = World.locationChanged;
AR.context.onScreenClick = World.onScreenClick;