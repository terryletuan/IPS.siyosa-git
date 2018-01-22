var mapAuto,
    _markersfindgprintAuto = [],
    _markersColorAuto = [],
    _dataAuto = [],
    dataflightPathAuto1 = [],
    _dataaddMarkerFindResult = [],
     keystar = "star";
$(document).ready(function() {
    $(".btn-autofind").click(function(event) {
        event.preventDefault();
        sys.Loading();
        $.when(sys.CallAjax("/Report/AutoFindTheWay", { idff: _dataAuto[0], idft: _dataAuto[1] })).done(function (data) {
            if (data !== "") {
                var pilotdata = [],
                    countp = data.length;
                $.each(data.LatLng, function (k, v) {
                    var latlng = new google.maps.LatLng(parseFloat(v.Lat), parseFloat(v.Lng));
                    pilotdata.push({ lat: parseFloat(v.Lat), lng: parseFloat(v.Lng) });
                    if (k === 0) {
                        var icons = new google.maps.MarkerImage('/Content/img/hoya-autofindroute-point-start.png', new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20));
                        _addMarkerFindResult(latlng, "Star",  _getColorFindAuto("red"), v.IdF);
                    }
                    if (k === (countp - 1)) {
                        var iconsend = new google.maps.MarkerImage('/Content/img/hoya-autofindroute-point-end.png', new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20));
                        _addMarkerFindResult(latlng, "End",  _getColorFindAuto("blue"), v.IdF);
                    }
                });
                _PolylineFindAuto(pilotdata);
                $(".totaldistanauto").text(data.Distance + " mater");
            } else {
                sys.Alert("Message", "No record", "Check");
                clearAutofind();
            }
            sys.HideLoading();
        });
    });

    $(".btn-autofind-clear").click(function(event) {
        event.preventDefault();
        clearAutofind();
    });
});

function initMapAuto() {
   var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: false,
        backgroundColor: 'none'
    };
    if ($("#mapSimulation").html().trim() === "") {
        mapAuto = new google.maps.Map(document.getElementById("mapautofind"), mapOptions);
        _showFloorlan(mapAuto);
        _getFindgprintAuto();
    }    
};

function _getFindgprintAuto() {
    sys.Loading();
    $.when(_getDataAccuweare("http://its.navizon.com/api/v1/sites/1696/levels/0/fingerprints/")).done(function (data) {
        $.each(data, function (k, v) {
            _addMarkerFindAuto(new google.maps.LatLng(v.lat, v.lng), v.id);
            //$.getJSON("/ConnectAccuware/SaveFindGprint", { id: v.id, lat: v.lat, lng: v.lng }, function (db) {

            //});
            
        });
        sys.HideLoading();
    });
};

function  _getColorFindAuto(color) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 3,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 0.4,
        strokeColor: 'black'
    };
};

function _addMarkerFindAuto(location, id) {
    var icons = new google.maps.MarkerImage('/Content/img/hoya-autofindroute-point-transparent.png', new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20));
    var marker = new google.maps.Marker({
        position: location,
        map: mapAuto,
        title: 'Hoya Tracking info',
        icon:  _getColorFindAuto("rgba(21, 20, 20, 0.12)"),
        id: id
    });

    _markersfindgprintAuto.push(marker);
    google.maps.event.addListener(marker, 'click', function () {      
        if (_dataAuto.length <= 1) {

            if (keystar === "star") {
                keystar = "end";
                var iconstar = new google.maps.MarkerImage('/Content/img/hoya-autofindroute-point-start.png', new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20));
                marker.setIcon( _getColorFindAuto("red"));
            } else {
                var end = new google.maps.MarkerImage('/Content/img/hoya-autofindroute-point-end.png', new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20));
                marker.setIcon( _getColorFindAuto("blue"));
            }
            _markersColorAuto.push(marker);
            _dataAuto.push(id);
            console.log(id);
        }        
    });
};

function _addMarkerFindResult(location,cont,id)
{
    var marker = new google.maps.Marker({
        position: location,
        map: mapAuto,
        title: 'Hoya Tracking info',
        icon:  _getColorFindAuto('red'),
        id: id
    });
    var infowindow = new google.maps.InfoWindow({
        content: cont
    });
    if (cont === "Star") {
        infowindow.open(mapAuto, marker);
    }
    if (cont === "End") {
        infowindow.open(mapAuto, marker);
    }

    _dataaddMarkerFindResult.push(marker);
};

function clearAutofind() {
    for (var i = 0; i < _dataaddMarkerFindResult.length; i++) {
        _dataaddMarkerFindResult[i].setMap(null);
    }
    _dataaddMarkerFindResult = [];
    for (var j = 0; j < dataflightPathAuto1.length; j++) {
        dataflightPathAuto1[j].setMap(null);
    }
    dataflightPathAuto1 = [];
    _dataAuto = [];
    for (var n = 0; n < _markersfindgprintAuto.length; n++) {
        var icons = new google.maps.MarkerImage('/Content/img/hoya-autofindroute-point-transparent.png', new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20));
        _markersfindgprintAuto[n].setIcon(_getColorFindAuto("rgba(21, 20, 20, 0.12)"));
    }
    keystar = "star";
};

function _PolylineFindAuto(data) {
    var flightPath = new google.maps.Polyline({
        path: data,
        icons: [{
            icon: SymbolPathAuto(),
            offset: '100%'
        }],
        strokeWeight: 2
    });
    dataflightPathAuto1.push(flightPath);
    flightPath.setMap(mapAuto);
};

function SymbolPathAuto() {
    return {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        scale: 4
    };
};
