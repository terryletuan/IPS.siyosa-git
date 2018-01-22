var mapanimation;
$(document).ready(function () {
});

function initanimation() {
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: false,
        backgroundColor: 'none'
    };
    mapanimation = new google.maps.Map(document.getElementById("mapanimation"), mapOptions);

    _showFloorlan(mapanimation);
}