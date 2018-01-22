
$(window).bind("load", function () {
    //$(".Fingerprints").css("display", "none");
    //$(".report").css("display", "none");
    //$(".weareaboutnew").css("display", "none");
    //$(".showmap_canvas").css("display", "none");

    weareaboutnew();
});
var Device_Of_Group,
    zoommax = 4,
    zoommin = 0,
    levelzoom = "",
    //thuoc group dau tien va co group id la 1 trong table sql
    dot0 = new google.maps.MarkerImage("/img/pointer-active-0.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    dot1 = new google.maps.MarkerImage("/img/pointer-active-1.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    dot2 = new google.maps.MarkerImage("/img/pointer-active-2.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    dot3 = new google.maps.MarkerImage("/img/pointer-active-3.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    dot4 = new google.maps.MarkerImage("/img/pointer-active-4.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20));

//thuoc group thu 2 va co group id la 2 trong table sql
var _Dotgroup1_01 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-0-blue.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    _Dotgroup1_02 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-1-blue.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    _Dotgroup1_03 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-2-blue.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    _Dotgroup1_04 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-3-blue.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    _Dotgroup1_05 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-4-blue.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),

    //thuoc group thu 3 va co group id la 3 trong table sql
    _Dotgroup2_01 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-0-green.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    _Dotgroup2_02 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-1-green.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    _Dotgroup2_03 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-2-green.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    _Dotgroup2_04 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-3-green.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
    _Dotgroup2_05 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-4-green.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),

    //thuoc group thu 4 va co group id la 4 trong table sql
     _Dotgroup3_01 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-0-orange.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
     _Dotgroup3_02 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-1-orange.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
     _Dotgroup3_03 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-2-orange.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
     _Dotgroup3_04 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-3-orange.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20)),
     _Dotgroup3_05 = new google.maps.MarkerImage("/img/zoomGroupmap/pointer-active-4-orange.png", new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20));
var map,
_map,
urlfloorpal,
DownloadFin,
Lat,
Lng,
Count = 0,
Count1 = 0,
_kmlLayer,
_kmlLayer_report,
keycheck = 0,
keycheck1 = 0,
keycheckdevice = "";
keyshow_rp = 0,
key_start_end = "",
markers = [],
markers2 = [],
markers1 = [],
Iconfloorlan = "https://s3.amazonaws.com/navizon.its.fp/1566/u0q2vla1dv_a.png",
timer = 2000;
var Incontracking1 = dot0;
var Incontracking = new google.maps.MarkerImage('http://indoortrack.siyosa-vn.com/img/indoor-report-dotactive.png',
                new google.maps.Size(35, 35),
                new google.maps.Point(0, 0),
                new google.maps.Point(20, 20));
$(document).ready(function () {

    ////bin chay fingerprint
    //nvzits.display_fingerprints.init();   

    ////// bin map
    ////initialize();
    //initialize2();

    ////get datafloopaln
    Getdatafloorlan();  

    //// bin flootlan
    //addFloorlan();

    ////auto scan lng, lat
    //setInterval(_Philip, timer, 0);
    //setInterval(_ZenPhone, timer, 0);

    _LoadDeviceofgroup(); // load danh sach thiet bi thuoc group trong database

    //show list device
    showdevice();
    showdevice_report();
    setInterval(showdevice, timer, 0);

    $("#showfingprint").click(function () {

        var _this = $(this);
        if (_this.text() == "Show Delete Fin") {
            _this.text("Hide Delete Fin");

            //show fingprint
            _Getfingprint();
            $(".displayfingerprint").slideDown();
        }
        else {
            $(".displayfingerprint").slideUp();
            _this.text("Show Delete Fin");
        }
    });

    $("#deleteallfingprint").click(function () {
        _deleteAllfind();
    });

    $("#downloadfingerprint").click(function () {
        downloadKMLfingerprint();
    });

    //zoom max map
    $(".btn-zoom-maxmap").click(function () {
        zoommax++;
        if(zoommax <= 4)
        {
            keycheck1 = 0;
            keycheck = 0;
            // clear check map
            if(zoommax == 0)
            {
                levelzoom = "0";
            }
            else if(zoommax == 1)
            {
                levelzoom = "1";
            }
            else if (zoommax == 2) {
                levelzoom = "2";
            }
            else if (zoommax == 3) {
                levelzoom = "3";
            }
            else
            {
                levelzoom = "4";
            }
        }
        else
            zoommax = 4;      
    });

    //zoom min map
    $(".btn-zoom-minmap").click(function () {
        zoommax--;
        if (zoommax >= 0) {

            keycheck1 = 0;
            keycheck = 0;// clear check map
            if (zoommax == 4) {
                levelzoom = "-4";
            }
            else if (zoommax == 3) {
                levelzoom = "-3";
            }
            else if (zoommax == 2) {
                levelzoom = "-2";
            }
            else if (zoommax == 1) {
                levelzoom = "-1";
            }
            else {
                levelzoom = "-0";
            }
        }
        else
            zoommax = -1;

    });
});


//function can thiep giao dien fingerprint moi
function margin30(){
    $(".deleteMenuButton").eq(0).addClass("margin30import");
}

//clear map
function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function setAllMap2(map) {
    for (var i = 0; i < markers2.length; i++) {
        markers2[i].setMap(map);
    }
}

//clear map
function setAllMap_report(_map) {
    for (var i = 0; i < markers1.length; i++) {
        markers1[i].setMap(_map);
    }
}

function initialize2() {
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: false,
        backgroundColor: 'none'
    };
    map = new google.maps.Map(document.getElementById("map_canvas2"), mapOptions);

    
}

//init của report map
function initialize() {
    mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: true
    };
    _map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);  
}

//Report tracking
function showmapreport()
{
    var star_date = $("#start_date").val(), end_date = $("#end_date").val(), device = $(".show-report-device").find("option:selected").val();
    if(star_date == "" || end_date == "")
    {
        alert("Please chose date! thanks");
        return false;
    }
    else
    {
        $(".loadxoayimg").fadeIn('slow');
        $.getJSON("/ConnectAccuware/Report_divice", { star_date: star_date, end_date: end_date, device: device }, function (data) {
            if(data != "" || data != null)
            {
                if (keyshow_rp == 0)
                {
                    $(".showmap_canvas").css("display", "block");
                    initialize();
                    addFloorlan_report();
                    keyshow_rp = 1;
                }
                setAllMap_report(null);
                $.each(data, function (i, o) {
                    addMarker_report(new google.maps.LatLng(o.Lat, o.Lng), "" + date_format(o.Date_time, 'H:m:s') + "", _map, Incontracking);
                    console.log(o.Date_time);
                });

                $(".loadxoayimg").fadeOut('slow');
            }
            else
            {
                alert("Not Data");
            }
        })
    }
}
      
// function addMarker
function addMarker(location, contentString, map, icon) {

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'google maps Tracking info',
        icon: icon
    });

    markers.push(marker);

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    infowindow.open(map, marker);

    //customer css infow window cua google map
    google.maps.event.addListener(infowindow, 'domready', function () {

        var iwOuter = $('.gm-style-iw');
        iwOuter.prev().remove();
        iwOuter.next().remove();
        iwOuter.addClass("inforcustom");
        iwOuter.find("div").addClass("inforcustom-ct1");
        iwOuter.find("div div").addClass("inforcustom-ct");
        iwOuter.find("div div").css("margin-top", "2px");
        iwOuter.parent().parent().css({ left: '25px', top: '40px' });
    });
};

// function addMarker
function addMarker2(location, contentString, map, icon) {

    var marker2 = new google.maps.Marker({
        position: location,
        map: map,
        title: 'google maps Tracking info',
        icon: icon
    });

    markers2.push(marker2);

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    infowindow.open(map, marker2);

    //customer css infow window cua google map
    google.maps.event.addListener(infowindow, 'domready', function () {

        var iwOuter = $('.gm-style-iw');
        iwOuter.prev().remove();
        iwOuter.next().remove();
        iwOuter.addClass("inforcustom");
        iwOuter.find("div").addClass("inforcustom-ct1");
        iwOuter.find("div div").addClass("inforcustom-ct");
        iwOuter.find("div div").css("margin-top","2px");
        iwOuter.parent().parent().css({ left: '25px', top: '40px' });
    });    
};

// function addMarker
function addMarker_report(location, contentString, map, icon) {

    var marker_report = new google.maps.Marker({
        position: location,
        map: map,
        title: 'google maps Tracking info',
        icon: icon
    });

    markers1.push(marker_report);

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    google.maps.event.addListener(marker_report, 'mousemove', function () {
        infowindow.open(map, marker_report);
    });

    google.maps.event.addListener(marker_report, 'mouseout', function () {
        // infowindow.open(map, marker);
        infowindow.close();
    });
};

function addFloorlan() {
    // Set new one
    _kmlLayer = new google.maps.KmlLayer({
        clickable: false,
        map: map,
        suppressInfoWindows: true,
        url: urlfloorpal
    });
    //_kmlLayer.setMap(map);
}

function addFloorlan_report() {
    // Set new one
    _kmlLayer_report = new google.maps.KmlLayer({
        clickable: false,
        map: _map,
        suppressInfoWindows: true,
        url: urlfloorpal
    });
    //_kmlLayer_report.setMap(_map);
}

//show full devices of site
function showdevice() {
    var _authorizationBase64, _username = "tuan.lequoc@siyosa.net", _password = "siyosa#123",
    url = "https://navimote2.navizon.com/api/v1/sites/1566/devices/?with=udo,status";
    _authorizationBase64 = Base64.encode(_username + ':' + _password);
    $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Authorization", "Basic " + _authorizationBase64);
        },
        success: function (result) {

            var html = "", html1 = "";
            $.each(result, function (i, o) {
                if (i % 2 == 0)
                    html += "<tr  role='row' class='odd'>";
                else
                    html += "<tr  role='row' class='even'>";
                html += "<td>" + o.mac + " </td>";
                html += "<td>" + o.udo.name + " </td>";
                if (o.position)
                    html += "<td> <a> <i class='gi gi-log_out'></i> " + o.position.lat + "," + o.position.lng + " </a></td>";
                else
                    html += "<td> n/a</td>";
                if (o.position)
                {
                    if (o.position.source == "n3" || o.position.source == "INDOORS/N3")
                        html += "<td>Indoors</td>";
                    else
                        html += "<td>Gobal</td>";
                }
                else
                    html += "<td>n/a</td>";
                
                if (o.device_status)
                    html += "<td> " + o.device_status.battery + "% </td>";
                else
                    html += "<td>n/a</td>";
                if (o.position)
                    html += "<td>" + get_timpans(o.position.fixed_at, o.current_server_time) + " </td>";
                else
                    html += "<td>n/a</td>";
                html += "</tr>";

                
            });
            if (html != "")
            {
                $(".show-device").html(html);
            }
               
        }
    });
}

//show full devices of site
function showdevice_report() {
    var _authorizationBase64, _username = "tuan.lequoc@siyosa.net", _password = "siyosa#123",
    url = "https://navimote2.navizon.com/api/v1/sites/1566/devices/?with=udo,status";
    _authorizationBase64 = Base64.encode(_username + ':' + _password);
    $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Authorization", "Basic " + _authorizationBase64);
        },
        success: function (result) {
            var html1 = "";
            $.each(result, function (i, o) {
                //show device on report combobox
                if (o.position)
                    html1 += "<option value='" + o.mac + "'> " + o.udo.name + " </option>";
            });
            if (html1 != "") {
                $(".show-report-device").html(html1);
                $(".List-device").html(html1);
            }

        }
    });
}

//convert time from timespan to date
function get_timpans(date, date1) {

    // Set the unit values in milliseconds.
    var msecPerMinute = 1000 * 60;
    var msecPerHour = msecPerMinute * 60;
    var msecPerDay = msecPerHour * 24;

    //convert time server
    var myDate = new Date(date * 1000);
    var myDate1 = new Date(date1 * 1000);
    var format = new Date(myDate);
    var format1 = new Date(myDate1);
    var m = format.getFullYear(), t = format.getMonth() + 1, n = format.getDate(), h = format.getHours(), p = format.getMinutes(), g = format.getSeconds(),
        m1 = format1.getFullYear(), t1 = format1.getMonth() + 1, n1 = format1.getDate(), h1 = format1.getHours(), p1 = format1.getMinutes(), g1 = format1.getSeconds();
    if (m < 10)
        m = '0' + m;
    if (t < 10)
        t = '0' + t;
    if (n < 10)
        n = '0' + n;
    if (h < 10)
        h = '0' + h;
    if (p < 10)
        p = '0' + p;
    if (g < 10)
        g = '0' + g;

    if (m1 < 10)
        m1 = '0' + m1;
    if (t1 < 10)
        t1 = '0' + t1;
    if (n1 < 10)
        n1 = '0' + n1;
    if (h1 < 10)
        h1 = '0' + h1;
    if (p1 < 10)
        p1 = '0' + p1;
    if (g1 < 10)
        g1 = '0' + g1;
    // Set a date and get the milliseconds
    var ok1 = t + "/" + n + "/" + m + " " + h + ":" + p + ":" + g;
    var ok2 = t1 + "/" + n1 + "/" + m1 + " " + h1 + ":" + p1 + ":" + g1;
    var date = new Date(ok1);
    var date1 = new Date(ok2);
    var interval = date1.getTime() - date.getTime();

    // Set the date to January 1, at midnight, of the specified year.
    //date.setMonth(0);
    //date.setDate(1);
    //date.setHours(0, 0, 0, 0);

    //// Get the difference in milliseconds.
    //var interval = dateMsec - date.getTime();

    // Calculate how many days the interval contains. Subtract that
    // many days from the interval to determine the remainder.
    var days = Math.floor(interval / msecPerDay);
    interval = interval - (days * msecPerDay);

    // Calculate the hours, minutes, and seconds.
    var hours = Math.floor(interval / msecPerHour);
    interval = interval - (hours * msecPerHour);

    var minutes = Math.floor(interval / msecPerMinute);
    interval = interval - (minutes * msecPerMinute);

    var seconds = Math.floor(interval / 1000);

    // Display the result.
    if (days != 0)
        return days + "d" + hours + "h" + minutes + "m" + seconds + "s" + " ago";
    else if (hours != 0)
        return hours + "h" + minutes + "m" + seconds + "s" + " ago";
    else if (minutes != 0)
        return minutes + "m" + seconds + "s" + " ago";
    else if (seconds != 0)
        return seconds + "s" + " ago";
    else
        return "0s ago";
    //Output: 164 days, 23 hours, 0 minutes, 0 seconds.
}

//formatdate
function date_format (_date, format) {
    var date = _date;
    var subStrDate = date.substring(6);
    var parseIntDate = parseInt(subStrDate);
    var date = new Date(parseIntDate);

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        nummonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    getPaddedComp = function (comp) {
        return ((parseInt(comp) < 10) ? ('0' + comp) : comp)
    },
    formattedDate = format,
    o = {
        "y+": date.getFullYear(), // year
        "M+": months[date.getMonth()], //month text
        "k+": nummonths[date.getMonth()], //month number
        "d+": getPaddedComp(date.getDate()), //day
        "h+": getPaddedComp((date.getHours() > 12) ? date.getHours() % 12 : date.getHours()), //hour
        "H+": getPaddedComp(date.getHours() + 1), //hour
        "m+": getPaddedComp(date.getMinutes()), //minute
        "s+": getPaddedComp(date.getSeconds()), //second
        "S+": getPaddedComp(date.getMilliseconds()), //millisecond,
        "b+": (date.getHours() >= 12) ? 'PM' : 'AM'
    };

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            formattedDate = formattedDate.replace(RegExp.$1, o[k]);
        }
    }
    return formattedDate;
};

//ham thiet bi
function Getautotracking1(device_mac, count, device_name) {
    $.when(_AutoShowDeviceonmap(device_mac)).done(function (result) {
        if(result != null & result != "")
        {
            if (result.position) {
                Latlng = result.position.lat + result.position.lng;
                if (Latlng != keycheck1) {
                    setAllMap2(null);
                    addMarker2(new google.maps.LatLng(result.position.lat, result.position.lng), "" + device_name + "", map, Incontracking1);
                    keycheck1 = Latlng;
                }
            }
        }
    })
};

//ham thiet bi
function Getautotracking(device_mac, count, device_name) {
    $.when(_AutoShowDeviceonmap(device_mac)).done(function (result) {
        if (result != null & result != "") {
            if (result.position) {
                Latlng = result.position.lat + result.position.lng;
                if (Latlng != keycheck) {
                    setAllMap2(null);
                    addMarker2(new google.maps.LatLng(result.position.lat, result.position.lng), "" + device_name + "", map, Incontracking1);
                    keycheck = Latlng;
                }
            }
        }
    })
};


//check color of group
function _Checkcolor(device_mac)
{
    $.each(Device_Of_Group, function (i, o) {
        if(o.Device_mac == device_mac)
        {
            // nhom mac dinh
            if (levelzoom == "")
            {
                if (o.ID_Group == "1")
                    Incontracking1 = dot0;
                else if (o.ID_Group == "2")
                    Incontracking1 = _Dotgroup1_01;
                else if (o.ID_Group == "3")
                    Incontracking1 = _Dotgroup2_01;
                else
                    Incontracking1 = _Dotgroup3_01;
            }

            // nhom zoom max
            if (levelzoom == "3" || levelzoom == "-4")
            {
                if (o.ID_Group == "1")
                    Incontracking1 = dot0;
                else if (o.ID_Group == "2")
                    Incontracking1 = _Dotgroup1_01;
                else if (o.ID_Group == "3")
                    Incontracking1 = _Dotgroup2_01;
                else
                    Incontracking1 = _Dotgroup3_01;
            }
            else if (levelzoom == "2" || levelzoom == "-3")
            {
                if (o.ID_Group == "1")
                    Incontracking1 = dot1;
                else if (o.ID_Group == "2")
                    Incontracking1 = _Dotgroup1_02;
                else if (o.ID_Group == "3")
                    Incontracking1 = _Dotgroup2_02;
                else
                    Incontracking1 = _Dotgroup3_02;
            }
            else if (levelzoom == "1" || levelzoom == "-2") {
                if (o.ID_Group == "1")
                    Incontracking1 = dot2;
                else if (o.ID_Group == "2")
                    Incontracking1 = _Dotgroup1_03;
                else if (o.ID_Group == "3")
                    Incontracking1 = _Dotgroup2_03;
                else
                    Incontracking1 = _Dotgroup3_03;
            }
            else if (levelzoom == "0" || levelzoom == "-1") {
                if (o.ID_Group == "1")
                    Incontracking1 = dot3;
                else if (o.ID_Group == "2")
                    Incontracking1 = _Dotgroup1_04;
                else if (o.ID_Group == "3")
                    Incontracking1 = _Dotgroup2_04;
                else
                    Incontracking1 = _Dotgroup3_04;
            }
            else if (levelzoom == "-0") {
                if (o.ID_Group == "1")
                    Incontracking1 = dot4;
                else if (o.ID_Group == "2")
                    Incontracking1 = _Dotgroup1_05;
                else if (o.ID_Group == "3")
                    Incontracking1 = _Dotgroup2_05;
                else
                    Incontracking1 = _Dotgroup3_05;
            }

             return; // thoat khoi vong lap
        }
    })
}

// ham goi du lieu thiet thiet bi tu server accuweare
function _AutoShowDeviceonmap(device_mac)
{
    _Checkcolor(device_mac);

    var _authorizationBase64, _username = "tuan.lequoc@siyosa.net", _password = "siyosa#123",
    url = "https://navimote2.navizon.com/api/v1/sites/1566/devices/" + device_mac + "/status/";
    _authorizationBase64 = Base64.encode(_username + ':' + _password);
    return $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Authorization", "Basic " + _authorizationBase64);
        }
    });
}

//thiet bi sam sung
function _Philip() {
    Count++;
    Getautotracking("WAHTZVCM7CM3", Count, "ss5");
};

//thiet bi zen phone 4
function _ZenPhone() {
    Count1++;
    Getautotracking1("WBO05Y5RI989", Count1,"Zen");
}

//load deviceofgroup
function _LoadDeviceofgroup()
{
    //$.getJSON("/Trackings/LoadDevice", {}, function (data) {
    //    Device_Of_Group = data;
    //})

    $.ajax({
        url: '/Trackings/LoadDevice',
        Type: 'GET',
        async: false,
        success: function (data) {
            console.log(data);
            Device_Of_Group = data;
        }
    });
}

//get infor fingprint
function _Getfingprint()
{
    $.when(_GetAccuweare("http://its.navizon.com/api/v1/sites/1566/levels/0/fingerprints/")).done(function (respone) {
        DownloadFin = respone;
        if(respone != "")
        {
            var html = "";
            $.each(respone, function (i, o) {
                html += "<tr class='clearprint'>";
                html += "<td>" + o.station + " </td>";
                html += "<td>" + o.id + " </td>";
                html += "<td>" + o.lat + " </td>";
                html += "<td>" + o.lng + " </td>";
                html += "<td><button class='js-delete btn btn-alt btn-primary' style='width: 20px;height: 20px;position: relative;' onclick='_deleteFin(this," + o.id + ")'><i class='fa fa-trash-o' style='position: absolute; top: 3px; left: 7px;'></i></button></td>";
                html += "</tr>";

            });
            $(".showfingerprint").html(html);
        }
    })
}

//delete
function _deleteFin(html, delete_fin)
{
    var _this = $(html);
        var url = "https://its.navizon.com/api/v1/sites/1566/levels/0/fingerprints/" + delete_fin + "/";
        $.when(_DeleteAccuweare(url)).done(function (respone) {
            if (respone != "") {
                _this.closest(".clearprint").remove();
            }
        })
}

//delete all
function _deleteAllfind()
{
    if (confirm("Are you sure delete all?")) {
        var url = "http://its.navizon.com/api/v1/sites/1566/levels/0/fingerprints/";
        $.when(_DeleteAccuweare(url)).done(function (respone) {
            if (respone != "") {
                alert("Delete sucess!");
                $(".clearprint").remove();
                console.log(respone);
            }
        })
    }
}

//get data floorplan
function Getdatafloorlan()
{
    $.when(_GetAccuweare("https://its.navizon.com/api/v1/sites/1566/floorplans/")).done(function (data) {
        if(data != "")
        {
            $.each(data, function (i, o) {
                urlfloorpal = o.kmlAligned;
                console.log(o.kmlAligned);
            })
            
        }
    })
}

function downloadKMLfingerprint()
{
    if (confirm("Are You Sure Download Fingerprint?")) {
        $.when(_GetAccuweare("https://its.navizon.com/api/v1/sites/1566/levels/0/fingerprints/?format=KML")).done(function (respone) {
                window.open('data:application/google-earth.kml+xml,' + encodeURIComponent(respone));
            })
            
        }
}

//function get, post, pust, delete accuweare
function _GetAccuweare(url)
{
    var _authorizationBase64, _username = "tuan.lequoc@siyosa.net", _password = "siyosa#123";
    _authorizationBase64 = Base64.encode(_username + ':' + _password);
    return $.ajax({
        type: 'GET',
        url: url,
        async: false,
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Authorization", "Basic " + _authorizationBase64);
        }
    });
}

function _DeleteAccuweare(url) {
    var _authorizationBase64, _username = "tuan.lequoc@siyosa.net", _password = "siyosa#123";
    _authorizationBase64 = Base64.encode(_username + ':' + _password);
    return $.ajax({
        type: 'DELETE',
        url: url,
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Authorization", "Basic " + _authorizationBase64);
        }
    });
}

function Fingerprints() {

}

function Fingerprintsnew() {

}

function noneFingerprints() {

}

function Report() {

}

function Group_Device()
{
    Report();
}

function Device_of_group()
{
    Report();
}

function weareaboutnew() {
    if ($("#map_canvas2").html().trim() == "")
    {
        initialize2();

        //get datafloopaln
        Getdatafloorlan();

        // bin flootlan
        addFloorlan();

        //auto scan lng, lat
        setInterval(_Philip, timer, 0);
        setInterval(_ZenPhone, timer, 0);
    }
 }

function _binmenu() {
    var html = "";
    html += "<ul class='sidebar-nav'>";

    //map
    html += "<li><a onclick='weareaboutnew()' class='js-goto' href='#'><i class='glyphicon glyphicon-th'></i> Map</a></li>";

    //report
    html += "<li>";
    html += "<a href='#' class='sidebar-nav-menu'><i class='fa fa-angle-left sidebar-nav-indicator'></i><i class='glyphicon glyphicon-th'></i> Report</a>";
    html += "<ul>";
    html += "<li><a href='#'>By tracked tag </a> </li>";
    html += "<li><a href='#'>By group </a> </li>";
    html += "<li><a href='#'>Compare 2 tracked tag</a> </li>";
    html += "</ul>";
    html += "</li>";

    //System management
    html += "<li>";
    html += "<a href='#' class='sidebar-nav-menu'><i class='fa fa-angle-left sidebar-nav-indicator'></i><i class='glyphicon glyphicon-signal'></i>System management</a>";
    html += "<ul>";
    html += "<li><a href='#' data-href='#wearabouts/devices' onclick='noneFingerprints()' class='js-goto'>On-cloud tracked tag</a></li>";
    html += "<li> <a href='#' onclick='Group_Device()' class='js-goto'>Group management</a></li>";
    html += "<li><a href='#' onclick='Device_of_group()' class='js-goto'>Tracked tag management</a></li>";
    html += "<li> <a href='#'>User group permission </a> </li>";
    html += "<li> <a href='#'>Local user management </a> </li>";
    html += "<li><a href='#' onclick='noneFingerprints()' data-href='#wearabouts/config' class='js-goto'>Configuration</a> </li>";
    html += "<li><a href='#' onclick='Fingerprints()' class='js-goto'>Fingerprints</a></li>";
    html += "</ul>";
    html += "</li>";

    //General
    html += "<li>";
    html += "<a href='#' class='sidebar-nav-menu open'><i class='fa fa-angle-left sidebar-nav-indicator'></i><i class='hi hi-th sidebar-nav-icon'></i>General</a>";
    html += "<ul>";
    html += "<li><a onclick='noneFingerprints()' href='#' data-href='#general/levels' class='js-goto'>Levels</a> </li>";
    html += "<li><a onclick='noneFingerprints()' href='#' data-href='#general/floorplans' class='js-goto'>Floor Plans</a></li>";
    html += "<li><li><a onclick='noneFingerprints()' data-href='#login' class='js-goto' href='#'><i class='glyphicon glyphicon-user'></i> Login</a> </li></li>";
    html += "</ul>";
    html += "</li>";

    html += "</ul>";
}