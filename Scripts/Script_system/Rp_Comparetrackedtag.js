var mapComparetrackedtag;
$(document).ready(function () {
});

function initComparetrackedtag() {
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: false,
        backgroundColor: 'none'
    };
    mapComparetrackedtag = new google.maps.Map(document.getElementById("mapComparetrackedtag"), mapOptions);

    _showFloorlan(mapComparetrackedtag);
}