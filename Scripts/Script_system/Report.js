var mapgroup,
    mapComparetrackedtag,
    maptracked;
$(document).ready(function () {
    //initMapReport();
});

function initMapReport() {
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: false,
        backgroundColor: 'none'
    };
    mapgroup = new google.maps.Map(document.getElementById("mapgroup"), mapOptions);
    maptracked = new google.maps.Map(document.getElementById("mapbttracked"), mapOptions);
    mapComparetrackedtag = new google.maps.Map(document.getElementById("mapComparetrackedtag"), mapOptions);
}