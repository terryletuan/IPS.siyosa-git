var maptracked,
    maptrackedF,
    maptrackedF1,
    _iconsizeDefaultRP = 5,
    markertracked = [],
    markertrackedGroup = [],
    markerCompare = [],
    markeranimation= [],
    dataflightPath = [],
    dataflightPathAuto = [],
    interval = null,
    keyrun = 0,
    timekey = 0,
    dataListdevice = null,
    dataR = null;
$(document).ready(function () {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd ;

    $("#fromdate_bytracked_tag").val(today + "T01:01:00.000");
    $("#Todate_bytrackedtag").val(today + "T23:01:00.000");

    $("#fromDateGroup").val(today + "T01:01:00.000");
    $("#toDateGroup").val(today + "T23:01:00.000");

    $("#FromdateCompare").val(today + "T01:01:00.000");
    $("#TodateCompare").val(today + "T23:01:00.000");

    $("#fromdate_bytracked_tagami").val(today + "T01:01:00.000");
    $("#Todate_bytrackedtagami").val(today + "T23:01:00.000");

    $("#fromdate_Rp_logtime").val(today + "T01:01:00.000");
    $("#Todate_Rp_logtime").val(today + "T23:01:00.000");



    //report for device
    $(".btn-rptrackedtag").on("click",function(event) {
        event.preventDefault();
        var devicecode = $(".bytrackedtag-device").find("option:selected").attr("data-mac"),
            fromdate = $("#fromdate_bytracked_tag").val(),
            todate = $("#Todate_bytrackedtag").val();
        if (fromdate === "" || todate === "") {
            sys.Alert("Message", "Please chose From date and To date!", "check");
            return;
        } else {
            sys.Loading();
            $.when(sys.CallAjax("/Report/Rp_by_tracked_tag", { devicecode: devicecode, fromdate: fromdate, todate: todate })).done(function (data) {
                if (data !== null) {
                    if (data.Listdevice !== null) {

                        var pilotdata = [];

                        //clear history
                        if (markertracked.length > 0) {
                            for (var i = 0; i < markertracked.length; i++) {
                                markertracked[i].setMap(null);
                            }
                            markertracked = [];
                            for (var j = 0; j < dataflightPath.length; j++) {
                                dataflightPath[j].setMap(null);
                            }
                            dataflightPath = [];
                        }
                        var key = 0,
                            countp = data.Listdevice.length;
                        $.each(data.Listdevice, function (k, v) {
                           
                            var lat = parseFloat(v.Lat),
                                lng = parseFloat(v.Lng);
                            _addMarkertracked(maptracked, new google.maps.LatLng(lat,lng), v.DateDevice, _getColorreport(data.Device_Color), "tracked");
                            key++;
                            //pilotdata.push({ lat: lat, lng: lng });
                            
                            //set điểm đầu và điểm cuối cho inforwindow
                            if (k === 0 || k === (countp - 1)) {
                                var content = "";
                                if (k === 0)
                                    content = "START";
                                else
                                    content = "END";

                                var infowindow = new google.maps.InfoWindow({
                                    content: content
                                });

                                infowindow.open(maptracked, markertracked[k]);
                            }
                                                               
                        });
                        //_Polyline(pilotdata, maptracked, "black");
                        //show detail
                        $(".datesystem").text(data.Datesystem);
                        $(".fromdatetracked").eq(0).text("From: " + data.Fromdate);
                        $(".fromdatetracked").eq(1).text(data.Fromdate);
                        $(".todatetracked").eq(0).text("To: " + data.Todate);
                        $(".todatetracked").eq(1).text(data.Todate);
                        $(".device-dp").text(data.Device1);
                        $(".totalaveage").text(data.Average_speed + " meter/hour");
                        $(".totaldistantracked").text(data.Total_distance + " meter");
                        $(".totalpoint").text(data.Total_recorded_points + " time");

                        sys.HideLoading();
                    }
                    else {
                        sys.HideLoading();
                        sys.Alert("Message", "There is no data recorded within this period, please select other timing period", "done");
                    }
                }
                sys.HideLoading();
            });
        }
    });

    // report tinh router
    $(".btn-rptrackedtagf").on("click", function (event) {
        event.preventDefault();
        var devicecode = $(".bytrackedtagF .bytrackedtag-devicef").find("option:selected").attr("data-mac"),
            fromdate = $(".bytrackedtagF #fromdate_bytracked_tagf").val(),
            todate = $(".bytrackedtagF #Todate_bytrackedtagf").val();
        if (fromdate === "" || todate === "") {
            sys.Alert("Message", "Please chose From date and To date!", "check");
            return;
        } else {
            sys.Loading();
            $.when(sys.CallAjax("/Report/Rp_by_tracked_tagf",
                { devicecode: devicecode, fromdate: fromdate, todate: todate })).done(function (data) {
                    if (data.data != null) {
                    if (data.data.Listdevice !== null) {

                        var pilotdata = [];

                        //clear history
                        if (markertracked.length > 0) {
                            for (var i = 0; i < markertracked.length; i++) {
                                markertracked[i].setMap(null);
                            }
                            markertracked = [];
                            for (var j = 0; j < dataflightPath.length; j++) {
                                dataflightPath[j].setMap(null);
                            }
                            dataflightPath = [];
                        }
                        var key = 0,
                            countp = data.data.Listdevice.length;
                        $.each(data.data.Listdevice, function (k, v) {

                            var lat = parseFloat(v.Lat),
                                lng = parseFloat(v.Lng);
                            _addMarkertracked1(maptrackedF, new google.maps.LatLng(lat, lng), v.DateDevice, _getColorreport(data.Device_Color), "tracked", v.IdGroup);
                            key++;
                            pilotdata.push({ lat: lat, lng: lng });

                            //set điểm đầu và điểm cuối cho inforwindow
                            if (k === 0 || k === (countp - 1)) {
                                var content = "";
                                if (k === 0)
                                    content = "START";
                                else
                                    content = "END";

                                var infowindow = new google.maps.InfoWindow({
                                    content: content
                                });

                                infowindow.open(maptracked, markertracked[k]);
                            }

                        });
                        _Polyline(pilotdata, maptrackedF, "black");
                        //show detail
                        $(".bytrackedtagF .datesystemf").text(data.data.Datesystem);
                        $(".bytrackedtagF .fromdatetrackedf").eq(0).text("From: " + data.data.Fromdate);
                        $(".bytrackedtagF .fromdatetrackedf").eq(1).text(data.data.Fromdate);
                        $(".bytrackedtagF .todatetrackedf").eq(0).text("To: " + data.data.Todate);
                        $(".bytrackedtagF .todatetrackedf").eq(1).text(data.data.Todate);
                        $(".bytrackedtagF .device-dpf").text(data.data.Device1);
                        $(".bytrackedtagF .totalaveagef").text(data.data.Average_speed + " meter/hour");
                        $(".bytrackedtagF .totaldistantrackedf").text(data.data.Total_distance + " meter");
                        $(".bytrackedtagF .totalpointf").text(data.data.Total_recorded_points + " time");

                        //an diem noi
                        if (data.listhide.length > 0) {
                            $.each(data.listhide, function(k, v) {
                                var idf = v.IdGroup;
                                for (var p = 0; p < markertracked.length; p++) {
                                    var marker = markertracked[p];
                                    if (marker.Id === idf) {
                                        marker.setMap(null);
                                        break;
                                    }
                                }
                            });                          
                        }
                        
                        sys.HideLoading();
                    }
                    else {
                        sys.HideLoading();
                        sys.Alert("Message", "There is no data recorded within this period, please select other timing period", "done");
                    }
                }
                sys.HideLoading();
            });
        }
    });

    $(".btn-rptrackedtagf1").on("click", function (event) {
        event.preventDefault();
        var devicecode = $(".bytrackedtagF1 .bytrackedtag-devicef1").find("option:selected").attr("data-mac"),
            fromdate = $(".bytrackedtagF1 #fromdate_bytracked_tagf1").val(),
            todate = $(".bytrackedtagF1 #Todate_bytrackedtagf1").val();
        if (fromdate === "" || todate === "") {
            sys.Alert("Message", "Please chose From date and To date!", "check");
            return;
        } else {
            sys.Loading();
            $.when(sys.CallAjax("/Report/Rp_by_tracked_tagf1",
                { devicecode: devicecode, fromdate: fromdate, todate: todate })).done(function (data) {
                    if (data.data != null) {
                        if (data.data.Listdevice !== null) {

                            var pilotdata = [];

                            //clear history
                            if (markertracked.length > 0) {
                                for (var i = 0; i < markertracked.length; i++) {
                                    markertracked[i].setMap(null);
                                }
                                markertracked = [];
                                for (var j = 0; j < dataflightPath.length; j++) {
                                    dataflightPath[j].setMap(null);
                                }
                                dataflightPath = [];
                            }
                            var key = 0,
                                countp = data.data.Listdevice.length;
                            $.each(data.data.Listdevice, function (k, v) {

                                var lat = parseFloat(v.Lat),
                                    lng = parseFloat(v.Lng);
                                _addMarkertracked1(maptrackedF1, new google.maps.LatLng(lat, lng), v.DateDevice, _getColorreport(data.Device_Color), "tracked", v.IdGroup);
                                key++;
                                pilotdata.push({ lat: lat, lng: lng });

                                //set điểm đầu và điểm cuối cho inforwindow
                                if (k === 0 || k === (countp - 1)) {
                                    var content = "";
                                    if (k === 0)
                                        content = "START";
                                    else
                                        content = "END";

                                    var infowindow = new google.maps.InfoWindow({
                                        content: content
                                    });

                                    infowindow.open(maptracked, markertracked[k]);
                                }

                            });
                            _Polyline(pilotdata, maptrackedF1, "black");
                            //show detail
                            $(".bytrackedtagF1 .datesystemf1").text(data.data.Datesystem);
                            $(".bytrackedtagF1 .fromdatetrackedf1").eq(0).text("From: " + data.data.Fromdate);
                            $(".bytrackedtagF1 .fromdatetrackedf1").eq(1).text(data.data.Fromdate);
                            $(".bytrackedtagF1 .todatetrackedf1").eq(0).text("To: " + data.data.Todate);
                            $(".bytrackedtagF1 .todatetrackedf1").eq(1).text(data.data.Todate);
                            $(".bytrackedtagF1 .device-dpf1").text(data.data.Device1);
                            $(".bytrackedtagF1 .totalaveagef1").text(data.data.Average_speed + " meter/hour");
                            $(".bytrackedtagF1 .totaldistantrackedf1").text(data.data.Total_distance + " meter");
                            $(".bytrackedtagF1 .totalpointf1").text(data.data.Total_recorded_points + " time");

                            //an diem noi
                            if (data.listhide.length > 0) {
                                $.each(data.listhide, function (k, v) {
                                    var idf = v.IdGroup;
                                    for (var p = 0; p < markertracked.length; p++) {
                                        var marker = markertracked[p];
                                        if (marker.Id === idf) {
                                            marker.setMap(null);
                                            break;
                                        }
                                    }
                                });
                            }

                            sys.HideLoading();
                        }
                        else {
                            sys.HideLoading();
                            sys.Alert("Message", "There is no data recorded within this period, please select other timing period", "done");
                        }
                    }
                    sys.HideLoading();
                });
        }
    });

    //report for group device
    $(".btn-searchgroupdevice").on("click", function (event) {
            event.preventDefault();
        var devicegroup = $(".bygroup-device").find("option:selected").val(),
                fromdate = $("#fromDateGroup").val(),
                todate = $("#toDateGroup").val();
            if (fromdate === "" || todate === "") {
                sys.Alert("Message", "Please chose From date and To date!", "check");
                return;
            } else {
                sys.Loading();
                $.when(sys.CallAjax("/Report/Rp_by_tracked_group", { devicegroup: devicegroup, fromdate: fromdate, todate: todate })).done(function (data) {
                    console.log(data);
                    if (data !== null) {
                        if (data.Listdevice !== null) {
                            var pilotdata = [];
                            //clear history
                            if (markertrackedGroup.length > 0) {
                                for (var i = 0; i < markertrackedGroup.length; i++) {
                                    markertrackedGroup[i].setMap(null);
                                }
                                markertrackedGroup = [];
                                for (var j = 0; j < dataflightPath.length; j++) {
                                    dataflightPath[j].setMap(null);
                                }
                                dataflightPath = [];
                            }
                            var key = 0;
                            var countp = data.Listdevice.length;
                            $.each(data.Listdevice, function (k, v) {
                                var lat = parseFloat(v.Lat),
                               lng = parseFloat(v.Lng);
                                _addMarkertracked(mapgroup, new google.maps.LatLng(lat, lng), v.DateDevice, _getColorreport(v.Device_Color), "trackedGroup");
                                // pilotdata.push({ lat: lat, lng: lng });
                                //set điểm đầu và điểm cuối cho inforwindow
                                if (k === 0 || k === (countp - 1)) {
                                    var content = "";
                                    if (k === 0)
                                        content = "START";
                                    else
                                        content = "END";

                                    var infowindow = new google.maps.InfoWindow({
                                        content: content
                                    });

                                    infowindow.open(mapgroup, markertrackedGroup[k]);
                                }
                            });
                           // _Polyline(pilotdata, mapgroup, "black");
                            //show detail
                            $(".datesystemgroup").text(data.Datesystem);
                            $(".fromdatetrackedgroup").eq(0).text("From: " + data.Fromdate);
                            $(".fromdatetrackedgroup").eq(1).text(data.Fromdate);
                            $(".todatetrackedgroup").eq(0).text("To: " + data.Todate);
                            $(".todatetrackedgroup").eq(1).text(data.Todate);
                            $(".groupname").text(data.Group1);
                            $(".totalaveagegroup").text(data.Average_speed + " meter/hour");
                            $(".totaldistantrackedgroup").text(data.Total_distance + " meter");
                            $(".totalpointgroup").text(data.Total_recorded_points + " time");

                            sys.HideLoading();
                        }
                        else {
                            sys.HideLoading();
                            sys.Alert("Message", "There is no data recorded within this period, please select other timing period", "done");
                        }

                    }
                    sys.HideLoading();
                });
            }
    });

    //report by comparetraced
    $(".btn-rpcompareok").on("click", function (event) {
        event.preventDefault();
        var device1 = $(".comparetracked-device1").find("option:selected").attr("data-mac"),
            device2 = $(".comparetracked-device2").find("option:selected").attr("data-mac"),
                fromdate = $("#FromdateCompare").val(),
                todate = $("#TodateCompare").val();
             if (fromdate === "" || todate === "") {
                sys.Alert("Message", "Please chose From date and To date!", "check");
                return;
            } else {
                sys.Loading();
                $.when(sys.CallAjax("/Report/Rp_Compare", { device1: device1, device2: device2, fromdate: fromdate, todate: todate })).done(function (data) {
                    console.log(data);
                    if (data !== null) {
                        if (data.Listdevice !== null) {
                            var pilotdata = [];
                            //clear history
                            if (markerCompare.length > 0) {
                                for (var i = 0; i < markerCompare.length; i++) {
                                    markerCompare[i].setMap(null);
                                }
                                markerCompare = [];
                                for (var j = 0; j < dataflightPath.length; j++) {
                                    dataflightPath[j].setMap(null);
                                }
                                dataflightPath = [];
                            }
                            var key = 0;
                            var countp = data.Listdevice.length;
                            $.each(data.Listdevice, function(k, v) {
                                var lat = parseFloat(v.Lat),
                                    lng = parseFloat(v.Lng);
                                _addMarkertracked(mapComparetrackedtag, new google.maps.LatLng(lat, lng), v.DateDevice, _getColorreport(v.Device_Color), "trackedcompare");
                                //pilotdata.push({ lat: lat, lng: lng });
                                //set điểm đầu và điểm cuối cho inforwindow
                                if (k === 0 || k === (countp - 1)) {
                                    var content = "";
                                    if (k === 0)
                                        content = "START";
                                    else
                                        content = "END";

                                    var infowindow = new google.maps.InfoWindow({
                                        content: content
                                    });

                                    infowindow.open(mapComparetrackedtag, markerCompare[k]);
                                }
                            });
                            key++;
                            //_Polyline(pilotdata, mapComparetrackedtag, "black");
                            //show detail
                            $(".datesystemcom").text(data.Datesystem);
                            $(".fromdatetrackedcom").eq(0).text("From: " + data.Fromdate);
                            $(".fromdatetrackedcom").eq(1).text(data.Fromdate);
                            $(".todatetrackedcom").eq(0).text("To: " + data.Todate);
                            $(".todatetrackedcom").eq(1).text(data.Todate);
                            $(".devicetracked1").text($(".comparetracked-device1").find("option:selected").text());
                            $(".devicetracked2").text($(".comparetracked-device2").find("option:selected").text());
                            $(".totalaveagecom1").text(data.Average_speed + " meter/hour");
                            $(".totalaveagecom2").text(data.Average_speed2 + " meter/hour");
                            $(".totaldistantrackedcom1").text(data.Total_distance + " meter");
                            $(".totaldistantrackedcom2").text(data.Total_distance2 + " meter");

                            sys.HideLoading();
                        } else {
                            sys.HideLoading();
                            sys.Alert("Message", "There is no data recorded within this period, please select other timing period", "done");
                        }
                            sys.HideLoading();
                    }
                    sys.HideLoading();
                });
            }
    });

    //report for device animation
    $(".btn-rptrackedtagami").on("click", function (event) {
        keyrun = 0; // key chay
        event.preventDefault();
        var devicecode = $(".bytrackedtag-deviceamini").find("option:selected").attr("data-mac"),
            fromdate = $("#fromdate_bytracked_tagami").val(),
            todate = $("#Todate_bytrackedtagami").val(),
            timeanimation = $(".numberanimation").val();
        if (fromdate === "" || todate === "") {
            sys.Alert("Message", "Please chose From date and To date!", "check");
            return;
        }
        else if (timeanimation === "") {
            sys.Alert("Message", "Please chose time animation!", "check");
            return;
        }
        else if (timeanimation < 0 || timeanimation > 9) {
            sys.Alert("Message", "Please chose time > 0 and < 10!", "check");
            return;
        }
        else {
            timeanimation = timeanimation + "000";
            sys.Loading();
            $.when(sys.CallAjax("/Report/Rp_by_tracked_tagf", { devicecode: devicecode, fromdate: fromdate, todate: todate })).done(function (data) {
                if (data.data != null) {
                    if (data.data.Listdevice  !== null) {

                        $(".mainstopstart").css("display", "block");

                        //clear history
                        if (markertracked.length > 0) {
                            for (var k = 0; k < markertracked.length; k++) {
                                markertracked[k].setMap(null);
                            }
                            markertracked = [];
                            for (var j = 0; j < dataflightPath.length; j++) {
                                dataflightPath[j].setMap(null);
                            }
                            dataflightPath = [];
                        }

                        timekey = timeanimation;
                        dataListdevice = data.data.Listdevice;
                        dataR = data.data;
                            //interval = window.setInterval(function() {
                            //    var v = data.Listdevice[keyrun];
                            //    keyrun++;

                            //    //clear map trừ 5 điểm sau cùng
                            //    if(k >= 6)
                            //        markertracked[keyrun - 6].setMap(null);

                            //    _addMarkertracked(mapanimation, new google.maps.LatLng(parseFloat(v.Lat), parseFloat(v.Lng)), v.DateDevice, _getColorreport(data.Device_Color), "tracked");

                            //    if (keyrun === count) {
                            //        window.clearInterval(interval);
                            //        _showreportanimation(data);
                            //    }
                                    
                        //}, parseFloat(timeanimation));
                        Runreportanimation();
                        sys.HideLoading();
                    }
                    else {
                        sys.HideLoading();
                        sys.Alert("Message", "There is no data recorded within this period, please select other timing period", "done");
                    }
                }
                sys.HideLoading();
            });
        }
    });

    //stop amimation
    $(".stop-animation").on("click", function(event) {
        window.clearInterval(interval);
    });

    $(".start-animation").on("click", function (event) {
        Runreportanimation();
    });

    //report for device
    $(".btn-Rp_logtime").on("click", function (event) {
        event.preventDefault();
        var devicecode = $(".Rp_logtime-device").find("option:selected").attr("data-mac"),
            fromdate = $("#fromdate_Rp_logtime").val(),
            todate = $("#Todate_Rp_logtime").val();
        if (fromdate === "" || todate === "") {
            sys.Alert("Message", "Please chose From date and To date!", "check");
            return;
        } else {
            sys.Loading();
            $.when(sys.CallAjax("/Report/Rp_logtime", { devicecode: devicecode, fromdate: fromdate, todate: todate })).done(function (data) {
                if (data !== null) {
                    var html = "";
                    $.each(data, function(k, v) {
                        html += "<tr>";
                        html += "<td>" + v.Macname + "</td>";
                        html += "<td>" + v.Groupname + "</td>";
                        html += "<td>" + v.Groupdec + "</td>";
                        html += "<td>" + sys.formatDateTime(v.CreateDate, "d-k-y") + "</td>";
                        html += "<td>" + sys.formatDateTime(v.CreateDate, "h-m-s b") + "</td>";
                        html += "<td>" + v.Notes + "</td>";
                        html += "</tr>";
                    });
                    $("#rplogtime").find("tbody").html(html);
                    sys.HideLoading();
                }
                else {
                    sys.HideLoading();
                    sys.Alert("Message", "There is no data recorded within this period, please select other timing period", "done");
                }
            });
        }
    });

    //export Excell pro :D
    $(".btn-exporttracked").on("click", function (event) {
        if (confirm('Are you sure export excel?')) {
            window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#mainexporttracked').html()));
        }
        event.preventDefault();
    });

    $(".btn-exportgroup").on("click", function (event) {
        if (confirm('Are you sure export excel?')) {
            window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#mainexporttrackedgroup').html()));
        }
        event.preventDefault();
    });

    $(".btn-exportcompare").on("click", function (event) {
        if (confirm('Are you sure export excel?')) {
            window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#mainreportcompare').html()));
        }
        event.preventDefault();
    });

});

function Runreportanimation() {
   var count = dataListdevice.length;
    interval = window.setInterval(function () {
        var v = dataListdevice[keyrun];
        keyrun++;

        //clear map trừ 5 điểm sau cùng
        if (keyrun >= 6)
            markertracked[keyrun - 6].setMap(null);
        if (markertracked.length > 0)
            markertracked[keyrun - 2].setIcon(_getColorreport(dataR.Device_Color));
        _addMarkertracked(mapanimation, new google.maps.LatLng(parseFloat(v.Lat), parseFloat(v.Lng)), v.DateDevice, _getColorreportAnimation(), "tracked");

        if (keyrun === count) {
            window.clearInterval(interval);
            _showreportanimation(dataR);
        }

    }, parseFloat(timekey));
};

function _showreportanimation(data) {
    //clear map
    for (var i = 0; i < markertracked.length; i++) {
        markertracked[i].setMap(null);
    }
    markertracked = [];
    var key = 0;
    var pilotdata = [];
    var countp = data.Listdevice.length;
    $.each(data.Listdevice, function (k, v) {

        var lat = parseFloat(v.Lat),
            lng = parseFloat(v.Lng);
        _addMarkertracked(mapanimation, new google.maps.LatLng(lat, lng), v.DateDevice, _getColorreport(data.Device_Color), "tracked");
        key++;
        //pilotdata.push({ lat: lat, lng: lng });

        //set điểm đầu và điểm cuối cho inforwindow
        if (k === 0 || k === (countp - 1)) {
            var content = "";
            if (k === 0)
                content = "START";
            else
                content = "END";

            var infowindow = new google.maps.InfoWindow({
                content: content
            });

            infowindow.open(mapanimation, markertracked[k]);
        }
    });
   // _Polyline(pilotdata, mapanimation, "black");
    //show detail
    $(".datesystemami").text(data.Datesystem);
    $(".fromdatetrackedami").text("From: " + data.Fromdate);
    $(".todatetrackedami").text("To: " + data.Todate);
    $(".device-dpami").text(data.Device1);
    $(".totalaveageami").text(data.Average_speed + " meter/hour");
    $(".totaldistantrackedami").text(data.Total_distance + " meter");
    $(".totalpointami").text(data.Total_recorded_points + " time");
};

function initMapBytraced() {
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: false,
        backgroundColor: 'none'
    };
    maptracked = new google.maps.Map(document.getElementById("mapbttracked"), mapOptions);
    _showFloorlan(maptracked);
};

function initMapBytracedF() {
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: false,
        backgroundColor: 'none'
    };
    maptrackedF = new google.maps.Map(document.getElementById("mapbttracked1"), mapOptions);
    _showFloorlan(maptrackedF);
};

function initMapBytracedF1() {
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: false,
        backgroundColor: 'none'
    };
    maptrackedF1 = new google.maps.Map(document.getElementById("mapbttracked11"), mapOptions);
    _showFloorlan(maptrackedF1);
};

function _addMarkertracked(map,location, contentString, icon, types) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Hoya Tracking info',
        icon: icon
    });

    if (types === "tracked")
        markertracked.push(marker);
    else if (types === "trackedGroup")
        markertrackedGroup.push(marker);
    else
        markerCompare.push(marker);

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, marker);
    });

    google.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
    });
};

function _addMarkertracked1(map, location, contentString, icon, types, idgroup) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Hoya Tracking info',
        icon: icon,
        Id: idgroup
    });

    if (types === "tracked")
        markertracked.push(marker);
    else if (types === "trackedGroup")
        markertrackedGroup.push(marker);
    else
        markerCompare.push(marker);

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, marker);
    });

    google.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
    });
};

function _getColorreport(color) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: _iconsizeDefaultRP,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 0.4,
        strokeColor: 'black'
    };
};

function _getColorreportAnimation() {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#f71c05',
        fillOpacity: 1,
        strokeWeight: 0.4,
        strokeColor: 'black'
    };
};

function _Polyline(data, map, color) {
    var flightPath = new google.maps.Polyline({
        path: data,
        icons: [{
            icon: SymbolPath(color),
            offset: '100%'
        }],
        strokeWeight: 2
    });
    dataflightPathAuto.push(flightPath);
    flightPath.setMap(map);
};

function SymbolPath(color) {
    return {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        scale: 4
    };
};