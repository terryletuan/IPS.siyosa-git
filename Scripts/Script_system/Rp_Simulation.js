var mapSimulation,
    _markersfindgprint = [],
    _markersColor = [],
    _datafindgprint = [],
    k = 0,
    stt = 0,
    idfind = 0,
    lat1 = null,
    lng1 = null,
    totaldistan = 0,
    datasimulation = [],
    totaldatasimulation = 0;
$(document).ready(function () {
    $(".btn-simulationnew").click(function(event) {
        event.preventDefault();
        var lat1 = 0, lng1 = 0, keys = 0, html = "";
        $("#data-simulationnew").find("tbody").html("");
        if (datasimulation.length < 2) {
            sys.Alert("Message", "Please chose >= 2 point  !", "Check");
            return false;
        } else {
            sys.Loading();
            $.each(datasimulation, function (k, v) {
                keys++;
                if (keys % 2 === 0) {
                   var distan = getDistanceFromLatLonInKm(lat1, lng1, v.lat, v.lng) * 1000;
                       distan = Math.round(distan);
                       totaldatasimulation += distan;

                       lat1 = v.lat;
                       lng1 = v.lng;
                       keys++;
                } else {
                    lat1 = v.lat;
                    lng1 = v.lng;
                }

                html += "<tr>";
                html += "<td>" + (k + 1) + "</td>";
                html += "<td>" + v.lat + "</td>";
                html += "<td>" + v.lng + "</td>";
                html += "<td>" + v.id + "</td>";
                html += "</tr>";

            });

            $(".totaldistannew").text(totaldatasimulation + " meter");
            $("#data-simulationnew").find("tbody").html(html);
            $("#data-simulationnew").css("display", "block");
            sys.HideLoading();
           
            totaldatasimulation = 0;
            datasimulation = [];
            for (var i = 0; i < _markersColor.length; i++) {
                _markersColor[i].setIcon(_getColorFind('Orange'));
            }
            _markersColor = [];
        }        
    });
});

function initMapmapSimulation() {
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: false,
        backgroundColor: 'none'
    };
    if ($("#mapSimulation").html().trim() === "") {
        mapSimulation = new google.maps.Map(document.getElementById("mapSimulation"), mapOptions);
        _showFloorlan(mapSimulation);
        _getFindgprint();
    }    
};

//function _choseSimulation(key) {
//    sys.Loading();
//    k++;
//    if (k === 1) {
//        $.each(_datafindgprint, function(p, v) {
//            if (v.id === key) {
//                lat1 = v.lat;
//                lng1 = v.lng;
//                idfind = key;
//                k = 2;

//                sys.HideLoading();
//                return false;
//            }
//        });
//    } else {
//        $.each(_datafindgprint, function (p, v) {
//            if (v.id === key) {
//                stt++;
//                var distan = getDistanceFromLatLonInKm(lat1, lng1, v.lat, v.lng) * 1000;
//                distan = Math.round(distan);
//                totaldistan += distan;

//                //tao html
//                var html = "";
//                html += "<tr>";
//                html += "<td>" + stt + " </td>";
//                html += "<td>" + lat1 + ", " + lng1 + " (id Findgprint: " + idfind + ") </td>";
//                html += "<td>" + v.lat + ", " + v.lng + " (id Findgprint: " + key + ")</td>";
//                html += "<td>" + distan + " meter</td>";
//                html += "</tr>";

//                $("#data-simulation").find("tbody").prepend(html);
//                $(".totaldistansimulation").text(totaldistan + " meter");

//                k = 0;
//                sys.HideLoading();
//                return false;
//            }
//        });
//    }
//};

function _choseSimulation(key) {
    $.each(_datafindgprint, function (p, v) {
        if (v.id === key) {            
            datasimulation.push({ id: key, lat: v.lat, lng: v.lng });
            return false;
        }
    });

    for (var i = 0; i < _markersfindgprint.length; i++) {
        var masker = _markersfindgprint[i];
        if (key === masker.id) {
            masker.setIcon(_getColorFind('blue'));
            _markersColor.push(masker);
            return;
        }
    }
};

function _getFindgprint() {
    $.when(_getDataAccuweare("http://its.navizon.com/api/v1/sites/1696/levels/0/fingerprints/")).done(function (data) {
        if (_markersfindgprint.length <= 0) {
            $.each(data, function(k, v) {
                _addMarkerFind(new google.maps.LatLng(v.lat, v.lng), v.id);
                var ob = new Object();
                ob.id = v.id;
                ob.lat = v.lat;
                ob.lng = v.lng;
                _datafindgprint.push(ob);
            });
        }
    });
};

function _getColorFind(color) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 3,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 0.4,
        strokeColor: 'black'
    };
};

function _addMarkerFind(location, id) {
    var marker = new google.maps.Marker({
        position: location,
        map: mapSimulation,
        title: 'Hoya Tracking info',
        icon: _getColorFind('Orange'),
        id: id
    });

    _markersfindgprint.push(marker);

    google.maps.event.addListener(marker, 'click', function () {
        _choseSimulation(id);
    });
};

// get distance from google maps
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}