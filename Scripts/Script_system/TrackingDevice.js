var _authorizationBase64,
    //_username = "hoya@siyosa-vn.com",
    //_password = "holv*#2016",
     _username = "tuan.lequoc@siyosa.net",
    _password = "siyosa#123",
    _authorizationBase64 = Base64.encode(_username + ':' + _password),
    //_site = 1696,
    _site = 1770,
    _maptracking,
    _maptrackingRealtime = null,
    _Floorlan,
    _markersTracking = new Array(),
    _markersTrackingRealtime = new Array(),
    _markersTrackingHistory = new Array(),
    _markersTrackingHistoryRealtime = new Array(),
    _iconsizeDefault = 5,
    _timer = 1000,
    _timerTracking,
    _timerTrackingRealtime,
    _hideshow = "",
    _dataFloorlan = null,
    _hideshowGobal = "",
    _dataInfor = [],
    DataPrintDevice = null,
    DataRealtimeMap = [],
    tb_RouterFindgprint = [],
    tb_GroupFindgprintDetail = [];
$(document).ready(function () {
    LoadDatacheck();
    _getFindgprintokok();
    _initMaptracking();
    _showdeviceTracking();
    //setInterval(_showdeviceTracking, 5000, 0);
    //zoom max map
    $(".btn-zoom-maxmap").click(function () {
        if (_iconsizeDefault < 12 && _iconsizeDefault >= 5) {
            _iconsizeDefault++;
            _CallMarkerwithZomm();
        }
    });

    //zoom min map
    $(".btn-zoom-minmap").click(function () {
        if (_iconsizeDefault <= 12 && _iconsizeDefault > 5) {
            _iconsizeDefault--;
            _CallMarkerwithZomm();
        }
    });

    //fullmap
    $(".js-full-screen").click(function() {
        $(".block-gmap").addClass("block-fullscreen");
        $(".button-on-map-fullscreen").css("display", "block");
        $("#map_tracking").css("height","768px");
    });

    $(".button-on-map-fullscreen").click(function() {
        $(".block-gmap").removeClass("block-fullscreen");
        $(".button-on-map-fullscreen").css("display", "none");
        $("#map_tracking .gmap").css("height", "480px");
    });
});

function weareaboutnewRealtime() {
    $("#map_tracking-realtime").removeClass("dispay_none");
    if (!$("#map_tracking").hasClass("dispay_none"))
        $("#map_tracking").addClass("dispay_none");
    _initMaptrackingRealtime();
}

function _initMaptracking() {
    mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: true
    };
    _maptracking = new google.maps.Map(document.getElementById("map_tracking"), mapOptions);

    _getFloorlanKML();

    _autoTrackingDefault();
    _getFindgprintokok();
};

function LoadDatacheck() {
    $.getJSON("/ConnectAccuware/GroupFindgprintDetail", {}, function (data) {
        tb_GroupFindgprintDetail = data;
    });
    $.getJSON("/ConnectAccuware/RouterFindgprint", {}, function (data) {
        tb_RouterFindgprint = data;
    });
}

function CheckGroup(idff, idft) {
    if (tb_RouterFindgprint.length === 0 || tb_GroupFindgprintDetail.length === 0) {
        sys.Alert("Error", "Device Error, plase load page again!", "Process");
        return false;
    }
    var kq = false;
    var group1 = 0;
    $.each(tb_GroupFindgprintDetail, function(k, v) {
        if (v.IdF === idff) {
            group1 = v.IdGroup;
            return;
        }
    });

    var group2 = 0;
    $.each(tb_GroupFindgprintDetail, function (k, v) {
        if (v.IdF === idft) {
            group2 = v.IdGroup;
            return;
        }
    });
    if (group1 === group2)
        kq = true;
    else {
        $.each(tb_RouterFindgprint, function (k, v) {
            if (v.FromGroup === group1 && v.ToGroup === group2) {
                kq = true;
                return;
            }
        });
    }
    return kq;
}

function _initMaptrackingRealtime() {
    if (_maptrackingRealtime == null) {
        mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(10.806068, 106.731191),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            tilt: 0,
            scaleControl: true
        };
        _maptrackingRealtime = new google.maps.Map(document.getElementById("map_tracking-realtime"), mapOptions);

        _getFloorlanKMLRealtime();

        _autoTrackingDefaultRealtime();
        _getFindgprintokok();
       
    } 
};

//danh cho map thiet bi
function _autoTracking() {
    $.when(_getDataAccuweare(_getUrlDevice())).done(function(device) {
        $.each(device, function (k, v) {
            if (v.position) {
                var latlng = v.position.lat + "-" + v.position.lng,
                    key = v.mac,
                    location = new google.maps.LatLng(v.position.lat, v.position.lng),
                    latlngold = _getLatLng(key);
                if (v.position.source === "INDOORS/N3" || v.position.source === "n3") {
                    if (latlng !== latlngold) {
                        if (_hideshow.indexOf(key) !== -1) { // kiểm tra điểm có được phép show lên hay không
                        } else {

                            //clear gobal
                            _hideshowGobal = _hideshowGobal.replace(key + "/", "");
                            var datalatlng = getFindgprint(v.position.lat, v.position.lng);
                            if (datalatlng !== null)
                                setPositoinMap(key, new google.maps.LatLng(datalatlng.lat, datalatlng.lng));
                            else
                                setPositoinMap(key, new google.maps.LatLng(v.position.lat, v.position.lng));
                        }
                    }
                } else {
                    if (_hideshowGobal.indexOf(key) !== -1) {
                    } else {
                        _deviceGobal(key);
                    }
                }
            }           
        });
    });
};

function _autoTrackingRealtime() {
    $.when(_getDataAccuweare(_getUrlDevice())).done(function (device) {
        $.each(device, function (k, v) {
            if (v.position) {
                var latlng = v.position.lat + "-" + v.position.lng,
                    key = v.mac,
                    location = new google.maps.LatLng(v.position.lat, v.position.lng),
                    latlngold = _getLatLngRealtime(key);
                if (v.position.source === "INDOORS/N3" || v.position.source === "n3") {
                    if (latlng !== latlngold) {
                        if (_hideshow.indexOf(key) !== -1) { // kiểm tra điểm có được phép show lên hay không
                        } else {

                            //clear gobal
                            _hideshowGobal = _hideshowGobal.replace(key + "/", "");
                            var datalatlng = getFindgprintRealtime(v.position.lat, v.position.lng);
                            if (datalatlng !== null) {
                                var db = datalatlng.split('-');
                                var idrel = $(".realtime_" + key),
                                    idf = idrel.attr("data-id");
                                if (idf === "0") {
                                    idrel.attr("data-id", db[2]);
                                    setPositoinMapRealtime(key, new google.maps.LatLng(parseFloat(db[0]), parseFloat(db[1])));
                                } else {
                                    if ($(".realtimeMapok li").length > 0) {
                                        var check = CheckGroup(parseInt(idf), parseInt(db[2]));
                                        if (check === true) {
                                            idrel.attr("data-id", db[2]);
                                            setPositoinMapRealtime(key, new google.maps.LatLng(parseFloat(db[0]), parseFloat(db[1])));
                                        }
                                    }                                   
                                }
                            }                                
                            else
                                setPositoinMapRealtime(key, new google.maps.LatLng(v.position.lat, v.position.lng));
                        }
                    }
                } else {
                    if (_hideshowGobal.indexOf(key) !== -1) {
                    } else {
                        _deviceGobal(key);
                    }
                }
            }
        });
    });
};

function setPositoinMap(key, position) {
    for (var i = 0; i < _markersTracking.length; i++) {
        var marker = _markersTracking[i],
            keyid = marker.id;
        if (keyid === key) {
            marker.setPosition(position);
            return;
        }
    }
}

function setPositoinMapRealtime(key, position) {
    for (var i = 0; i < _markersTrackingRealtime.length; i++) {
        var marker = _markersTrackingRealtime[i],
            keyid = marker.id;
        if (keyid === key) {
            marker.setPosition(position);
            return;
        }
    }
}

function returnIcon(key) {
    return new google.maps.MarkerImage(_getColor(key), new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20));
}

function _autoTrackingDefault() {
    $.when(_getDataAccuweare(_getUrlDevice())).done(function (device) {
        var htmloption = "", html2 = "";
        $.each(device, function (k, v) {
            if (v.position) {
                var latlng = v.position.lat + "-" + v.position.lng,
                    key = v.mac,
                    location = new google.maps.LatLng(v.position.lat, v.position.lng);
                //var icon = new google.maps.MarkerImage(_getColor(key), new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20));
                _addMarkerDevice(location, v.udo.name, _getColor(key), key);

                    //add history
                    var history = new Object();
                    history.mac = key;
                    history.value = latlng;
                    _markersTrackingHistory.push(history);

                    if ($(".List-device").find("option").length === 0) {
                        htmloption += "<option value='" + v.mac + "'> " + v.udo.name + " </option>";
                    }
            }
        });

        _timerTracking = setInterval(_autoTracking, _timer, 0);

        //show select at tracked tag management
        if (htmloption !== "") {
            $(".realtimeMapok").html(html2);
        }
    });
};

function _autoTrackingDefaultRealtime() {
    $.when(_getDataAccuweare(_getUrlDevice())).done(function (device) {
        var htmloption = "", html2 = "";
        $.each(device, function (k, v) {
            if (v.position) {
                var latlng = v.position.lat + "-" + v.position.lng,
                    key = v.mac,
                    location = new google.maps.LatLng(v.position.lat, v.position.lng);
                //var icon = new google.maps.MarkerImage(_getColor(key), new google.maps.Size(35, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 20));
                _addMarkerDeviceRealtime(location, v.udo.name, _getColor(key), key);

                //add history
                var history = new Object();
                history.mac = key;
                history.value = latlng;
                _markersTrackingHistoryRealtime.push(history);


                if ($(".List-device").find("option").length === 0) {
                    htmloption += "<option value='" + v.mac + "'> " + v.udo.name + " </option>";
                    html2 += "<li class='realtime_"+v.mac+"' data-id='0'> </li>";
                }
            }
        });
        _timerTrackingRealtime = setInterval(_autoTrackingRealtime, _timer, 0);
        //show select at tracked tag management
        if (htmloption !== "") {            
            $(".List-device").html(htmloption);
            $(".realtimeMapok").html(html2);
        }
    });
};

function _deviceGobal(key) {
    for (var i = 0; i < _markersTracking.length; i++) {
        var marker = _markersTracking[i];
        var mac = marker.id;
        if (key === mac) {
            var position = new google.maps.LatLng(11.081781, 106.681647);
            marker.setPosition(position);
            _maptracking.panTo(position);
            _hideshowGobal += key + "/";
        }
    }
}

function _addMarkerDevice(location, contentString, icon,id) {
    var marker = new google.maps.Marker({
        position: location,
        map: _maptracking,
        title: 'Siyosa Tracking info',
        icon: icon,
        id:id
    });

    _markersTracking.push(marker);

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    

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
    _dataInfor.push({ key: id, info: infowindow });
    infowindow.open(_markersTracking, marker);
    //marker.setVisible(false);
    //marker.hideInfoWindow();
};

function _addMarkerDeviceRealtime(location, contentString, icon, id) {
    var marker = new google.maps.Marker({
        position: location,
        map: _maptrackingRealtime,
        title: 'Hoya Tracking info',
        icon: icon,
        id: id
    });

    _markersTrackingRealtime.push(marker);

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });


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
    //_dataInfor.push({ key: id, info: infowindow });
    infowindow.open(_maptrackingRealtime, marker);
    //marker.setVisible(false);
    //marker.hideInfoWindow();
};

function _CallMarkerwithZomm() {
    _clearAutotracking(); //stop function auto
    _clearAllMarker();
    _autoTrackingDefault();
};

function _clearAutotracking() {
    if (_timerTracking)
        clearInterval(_timerTracking);
};

function _clearMarkerDevice(key) {
    for (var i = 0; i < _markersTracking.length; i ++) {
        var marker = _markersTracking[i],
            keyid = marker.id;
        if (keyid === key) {
            marker.setMap(null);

            //delete point on map
            var positionok = _markersTracking.indexOf(marker);
            _markersTracking.splice(positionok, 1);

            //clear history
            $.each(_markersTrackingHistory, function (k, v) {
                if (typeof v !== "undefined") {
                    var keyok = v.mac;
                    if (keyok === key) {
                        _markersTrackingHistory.splice(v, 1);
                        return;
                    }
                }              
            });
            return;
        }
    }
};

function _clearAllMarker() {
    for (var i = 0; i < _markersTracking.length; i ++) {
        _markersTracking[i].setMap(null);
    }
    _markersTracking = [];
    _markersTrackingHistory = [];
};

function _getLatLng(key) {
    var data = null;
    $.each(_markersTrackingHistory, function(k, v) {
        if (v.mac === key);
        {
            data = v.value;
            return false;
        }        
    });
    return data;
};

function _getLatLngRealtime(key) {
    var data = null;
    $.each(_markersTrackingHistoryRealtime, function (k, v) {
        if (v.mac === key);
        {
            data = v.value;
            return false;
        }
    });
    return data;
};

function _splitkey(key) {
    var k = key.split('-'),
        lat = "", lng = "";
    if (k[0].length >= 8)
        lat = k[0].substring(0, 8);
    if (k[1].length >= 8)
        lng = k[1].substring(0, 8);
    return lat + "-" + lng;

};

function _showdeviceTracking() {
    $.when(_getDataAccuweare(_getUrlDevice())).done(function (device) {
        var html = "";
        html += "<table class='dataTable no-footer table table-vcenter table-condensed table-bordered' id='tracking-device-table' >";
        html += "<thead>";
        html += "<tr>";
        html += "<th>MAC</th>";
        html += "<th>Name</th>";
        html += "<th>Position</th>";
        html += "<th>Battery</th>";
        html += "<th>Last Seen</th>";
        html += "<th>Show/Hide</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        $.each(device, function (i, o) {
            html += "<tr  role='row' class='de_" + o.mac + "' mac='"+o.mac+"'>";
            html += "<td>" + o.mac + " </td>";
            html += "<td>" + o.udo.name + " </td>";
            if (o.position)
                html += "<td class='latlng'> <a> <i class='gi gi-log_out'></i> " + o.position.lat + "," + o.position.lng + " </a></td>";
            else
                html += "<td> n/a</td>";          

            if (o.device_status)
                html += "<td class='battery'> " + o.device_status.battery + "% </td>";
            else
                html += "<td>n/a</td>";
            if (o.position)
                html += "<td class='current_server_time'>" + _getTimpans(o.position.fixed_at, o.current_server_time) + " </td>";
            else
                html += "<td>n/a</td>";
            html += "<td><label  class='switch switch-primary'><input style='width: 50px; height: 22px;' onclick='_showhidendevice(this)' check='0' class='js-check' type='checkbox'><span></span></label></td>";
            html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";
        //$(".main-table-tracking").html(html);
        $("#tracking-device-table").dataTable();

        //auto chay lien tuc cap nhat thong tin
        setInterval(_autoupdateinforDevice, 5000, 0);
    });
};

function _showhidendevice(obj) {
    var _this = $(obj),
        value = _this.attr("check"),
        mac = _this.closest("tr").attr("mac");
    if (value === "0") {
        _hideshow += mac + "/";
        Prdeviceshow(mac, "hide");
        _this.attr("check", "1");
    } else {
        _hideshow = _hideshow.replace(mac + "/", "");
        Prdeviceshow(mac, "show");
        _this.attr("check", "0");
    }  
};

function Prdeviceshow(key, status) {
    for (var i = 0; i < _markersTracking.length; i++) {
        var marker = _markersTracking[i],
            keyid = marker.id;
        if (keyid === key) {
            if (status === "hide") {
                marker.setVisible(false);

                //hide infor
                returnInforwindow(keyid).close();
            } else {
                marker.setVisible(true);
                returnInforwindow(keyid).open(_markersTracking, marker);
            }
            return;
        }
    }
}

function returnInforwindow(key) {
    var inw = null;
    $.each(_dataInfor, function(k, v) {
        if (v.key === key) {
            inw = v.info;
            return false;
        }
    });
    return inw;
}

//ket thuc map thiet bi

//function dung chung
function _getFloorlanKML() {
    var url = "https://its.navizon.com/api/v1/sites/" + _site + "/floorplans/";
    $.when(_getDataAccuweare(url)).done(function (data) {
        $.each(data, function (k, v) {
            _dataFloorlan = v.kmlAligned;
            console.log(v.kmlAligned);
            _Floorlan = new google.maps.KmlLayer({
                clickable: false,
                map: _maptracking,
                suppressInfoWindows: true,
                url: v.kmlAligned
            });
        });
    });
};

//
function _getFloorlanKMLRealtime() {
    var url = "https://its.navizon.com/api/v1/sites/" + _site + "/floorplans/";
    $.when(_getDataAccuweare(url)).done(function (data) {
        $.each(data, function (k, v) {
            _dataFloorlan = v.kmlAligned;
            console.log(v.kmlAligned);
          var  _FloorlanReatime = new google.maps.KmlLayer({
                clickable: false,
                map: _maptrackingRealtime,
                suppressInfoWindows: true,
                url: v.kmlAligned
            });
        });
    });
};

//show foorlanKML for all report
function _showFloorlan(map) {
    _Floorlan = new google.maps.KmlLayer({
        clickable: false,
        map: map,
        suppressInfoWindows: true,
        url: _dataFloorlan
    });
}

function _getUrlDevice() {
    return _getUrlmain() + _site + "/" + "devices?with=udo,status";
};

function _autoupdateinforDevice() {
    $.when(_getDataAccuweare(_getUrlDevice())).done(function(device) {
        $.each(device, function(k, v) {
            var update = $(".de_" + v.mac);
            if (v.position) {
                update.find("td.latlng").html("<a> <i class='gi gi-log_out'></i> " + v.position.lat + "," + v.position.lng + " </a>");
                update.find("td.current_server_time").html(_getTimpans(v.position.fixed_at, v.current_server_time));
            }
            if (v.device_status) {
                update.find("td.battery").html(v.device_status.battery + "%");

                //update cho ben quan ly device
                if ($(".device_" + v.mac).length > 0)
                    $(".device_" + v.mac).html(v.device_status.battery + "%");
            }
               
        });
    });
}

//convert time from timespan to date
function _getTimpans(date, date1) {

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
};

function _getUrlmain() {
    return "https://navimote2.navizon.com/api/v1/sites/";
};

function _getDataAccuweare(url) {
    return $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Authorization", "Basic " + _authorizationBase64);
        }
    });
};

function _getColor(device) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: _iconsizeDefault,
        fillColor: _getColorByDevice(device),
        fillOpacity: 1,
        strokeWeight: 0.4,
        anchor: new google.maps.Point(0,0),
        strokeColor: 'black'
    };
};

function _getColorByDevice(device) {
    var obj = $("li." + device),
        color = "Red";
    if (obj.length > 0) {
        color = obj.attr("data-color");
    }
    return color;
};
//kết thúc function dùng chung
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
};

function deg2rad(deg) {
    return deg * (Math.PI / 180);
};

function getFindgprint(lat, lng) {
    if (DataPrintDevice === null) {
        return null;
    } else {
        var totaldistan = [],
        keylatlan = [];

        $.each(DataPrintDevice, function (p, pp) {
            var distan = getDistanceFromLatLonInKm(lat, lng, pp.lat, pp.lng);
            totaldistan.push(distan);
            keylatlan.push({ lat: pp.lat, lng: pp.lng });
        });

        //tinh maxmin
        var min = Math.min.apply(null, totaldistan);
        var positionll = totaldistan.indexOf(min);
        return keylatlan[positionll];
    }   
};

function getFindgprintRealtime(lat, lng) {
    if (DataPrintDevice === null) {
        return null;
    } else {
        var totaldistan = [],
        keylatlan = [];

        $.each(DataPrintDevice, function (p, pp) {
            var distan = getDistanceFromLatLonInKm(lat, lng, pp.lat, pp.lng);
            var latlng = pp.lat + "-" + pp.lng + "-" + pp.id;
            totaldistan.push(distan);
            keylatlan.push(latlng);
        });

        //tinh maxmin
        var min = Math.min.apply(null, totaldistan);
        var positionll = totaldistan.indexOf(min);
        return keylatlan[positionll];
    }   
};

function _getFindgprintokok() {
    $.when(_getDataAccuweare("http://its.navizon.com/api/v1/sites/" + _site + "/levels/0/fingerprints/")).done(function (data) {
        DataPrintDevice = data;
        console.log("completed load fingprint");
    });
};