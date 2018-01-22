var mapgroup;
$(document).ready(function () {
});

function initMapgroup() {
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: false,
        backgroundColor: 'none'
    };
    mapgroup = new google.maps.Map(document.getElementById("mapgroup"), mapOptions);

    _showFloorlan(mapgroup);
}