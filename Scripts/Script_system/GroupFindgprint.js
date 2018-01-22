var MapmapGroupfindgprint,
    _datafindgprintGroup = [],
    _markersfindgprintGroup = [],
    _defaultGroup = [],
    _markersColorGroup = [],
    _markersColorGroupDefault = [],
    _dataGroup = [],
    keychose= "",
    _dataSetGroup = "";
$(document).ready(function () {
    $(".btn-addnewgroupF").on("click", function(event) {
        event.preventDefault();
        var idf = $(".form-idf").val(),
            namef = $(".form-namef").val().trim(),
            obj = $(this);
        if (namef === "") {
            sys.Alert("Warning", "Please enter name group!", "Check");
            return;
        }
        if (_dataGroup.length <= 0) {
            sys.Alert("Warning", "Please set group findgprint on map!", "Check");
            return;
        }
        if (_defaultGroup.length <= 0) {
            sys.Alert("Warning", "Please set point default of group!", "Check");
            return;
        } else {
            sys.disButon(obj);
            sys.Loading();
            var object = new Object();
            object.Id = idf;
            object.Name = namef;
            object.Lat = _dataGroup[0].Lat;
            object.Lng = _dataGroup[0].Lng;
            object.IdF = _dataGroup[0].IdF;
            object.ListItem = _dataGroup;
            $.when(sys.CallAjaxPost("/ConfigFindgprint/Addnew", object)).done(function (data) {
                sys.Alert("Sucess", "Save complate!", "Check");
                _clearformF();
                sys.enButon(obj);
                GetAllGroupF();
                sys.HideLoading();

            });
        }
    });
    $(".btn-menug").click(function(event) {
        var val = $(this).attr("data-key");
        if (val === "group") {
            $(".managergroup").removeClass("dispay_none");
            $(".managerRouter").addClass("dispay_none");
            $(".managerRouterlist").addClass("dispay_none");

        } else if (val === "router") {
            $(".managerRouter").removeClass("dispay_none");
            $(".managergroup").addClass("dispay_none");
            $(".managerRouterlist").addClass("dispay_none");
        } else {
            $(".managerRouter").addClass("dispay_none");
            $(".managergroup").addClass("dispay_none");
            $(".managerRouterlist").removeClass("dispay_none");
            LoadRouter();
        }
    });
    $(".btn-saverouter").on("click", function(event) {
        event.preventDefault();
        var _this = $(this);
        if (_dataSetGroup === "") {
            sys.Alert("Warning", "Please select router!", "Check");
            return;
        } else {
            sys.Loading();
            var obj = new Object();
            obj.Id = $(".IdRouter").val();
            obj.FromGroup = $(".form-groupF").find("option:selected").val();
            obj.ToGroup = $(".to-groupF").find("option:selected").val();
            obj.Notes = $(".notesf").val().trim();
            obj.ListItem = _dataSetGroup;
            $.when(sys.CallAjaxPost("/ConfigFindgprint/AddRouter", obj)).done(function (data) {
                sys.Alert("Sucess", "Save complate!", "Check");
                $(".notesf").val("");
                _dataSetGroup = "";
                $(".chose-router").prop("checked", false);
                sys.HideLoading();
                $("#data-grouplistline").attr("data-key", "none");
            });

        }
    });
    $(".btn-cleanewgroupF").on("click", function (event) {
        _clearformF();
    });
});

function LoadRouter() {
    var key = $("#data-grouplistline").attr("data-key");
    if (key === "none") {
        $.getJSON("/ConfigFindgprint/ListRouter", {}, function (data) {
            if (data != null) {
                var html = "";
                $.each(data, function(k, v) {
                    html += "<tr>";
                    html += "<td>"+(k + 1)+" </td>";
                    html += "<td>" + v.FromgroupName + " </td>";
                    html += "<td>" + v.ToGroupName + " </td>";
                    html += "<td>" + v.LineGroup + " </td>";
                    html += "</tr>";
                });
                $("#data-grouplistline").find("tbody").html(html);
                //sys.Pageing2($("#data-grouplistline"));
                $("#data-grouplistline").attr("data-key", "ok");
            }
        });
    }
}

function initMapmapGroupfindgprint() {
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.806068, 106.731191),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        tilt: 0,
        scaleControl: false,
        backgroundColor: 'none'
    };
    if ($("#mapGroupFindgprint").html().trim() === "") {
        MapmapGroupfindgprint = new google.maps.Map(document.getElementById("mapGroupFindgprint"), mapOptions);
        _showFloorlan(MapmapGroupfindgprint);
        _getFindgprintGroup();
    }
};

function _getFindgprintGroup() {
    sys.Loading();
    $.when(_getDataAccuweare("http://its.navizon.com/api/v1/sites/1696/levels/0/fingerprints/")).done(function (data) {
        if (_datafindgprintGroup.length <= 0) {
            $.each(data, function (k, v) {
                _addMarkerFindGroup(new google.maps.LatLng(v.lat, v.lng), v.id);
                var ob = new Object();
                ob.id = v.id;
                ob.lat = v.lat;
                ob.lng = v.lng;
                _datafindgprintGroup.push(ob);
            });
            sys.HideLoading();
        }
    });
    GetAllGroupF();
};

function _addMarkerFindGroup(location, id) {
    var marker = new google.maps.Marker({
        position: location,
        map: MapmapGroupfindgprint,
        title: 'Hoya Tracking info',
        icon: _getColorFindGroup('red'),
        id: id
    });

    _markersfindgprintGroup.push(marker);

    google.maps.event.addListener(marker, 'click', function () {
        _choseGroup(id);
    });
    google.maps.event.addListener(marker, 'dblclick', function () {
        _choseGroupDefault(id);
    });
};

function _getColorFindGroup(color) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 3,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 0.4,
        strokeColor: 'black'
    };
};

function _choseGroupDefault(key) {

    //lưu điểm mặc định cho group findgprint
    $.each(_datafindgprintGroup, function (p, v) {
        if (v.id === key) {
            _defaultGroup = [];
            _defaultGroup.push({Lat: v.lat, Lng: v.lng,IdF:key });
            return false;
        }
    });

    //set màu điểm trước đó nếu có
    if (_markersColorGroupDefault.length > 0) {
        for (var i = 0; i < _markersColorGroupDefault.length; i++) {
            _markersColorGroupDefault[i].setIcon(_getColorFindGroup('red'));
        }
        _markersColorGroupDefault = [];
    }
   
    //active màu điểm đã chọn
    for (var i = 0; i < _markersfindgprintGroup.length; i++) {
        var masker = _markersfindgprintGroup[i];
        if (key === masker.id) {
            masker.setIcon(_getColorFindGroup('blue')); //ở file rp_simulation
            _markersColorGroupDefault.push(masker);
            return;
        }
    }    
};

function _choseGroup(key) {
    if (keychose.indexOf(key.toString()) !== -1)
    { }
    else
    {
        $.each(_datafindgprintGroup, function (p, v) {
            if (v.id === key) {
                _dataGroup.push({ KeyLatLng: v.lat + "-" + v.lng, Lat: v.lat, Lng: v.lng, IdF: v.id });
                keychose += key.toString() + " ";
                return false;
            }
        });

        for (var i = 0; i < _markersfindgprintGroup.length; i++) {
            var masker = _markersfindgprintGroup[i];
            if (key === masker.id) {
                masker.setIcon(_getColorFindGroup('black')); //ở file rp_simulation
                _markersColorGroup.push(masker);
                return;
            }
        }
    }  
};

function _clearformF() {
    _dataGroup = [];
    _defaultGroup = [];
    keychose = "";
    $(".form-idf").val("0");
    $(".form-namef").val("");
    //clear màu điểm trước đó nếu có
    if (_markersColorGroupDefault.length > 0) {
        for (var i = 0; i < _markersColorGroupDefault.length; i++) {
            _markersColorGroupDefault[i].setIcon(_getColorFindGroup('red'));
        }
        _markersColorGroupDefault = [];
    }
    if (_markersColorGroup.length > 0) {
        for (var j = 0; j < _markersColorGroup.length; j++) {
            _markersColorGroup[j].setIcon(_getColorFindGroup('red'));
        }
        _markersColorGroup = [];
    }
};

function GetAllGroupF() {
    $.getJSON("/ConfigFindgprint/GetAll", {}, function(data) {
        if (data != null) {
            var html = "", html1 = "", html2;
            $.each(data, function(k, v) {
                html += "<tr data-id='" + v.IdGroup + "'>";
                html += "<td>"+(k + 1)+"</td>";
                html += "<td>" + v.GroupName + "</td>";               
                html += "<td><a href='#' onclick='DeleteGf(this)'>Delete</a> | <a href='#' onclick='ViewGroup(" + v.IdGroup + ")'>View</a> </td>";
                html += "</tr>";

                //html router
                html1 += "<tr data-id='" + v.IdGroup + "'>";
                html1 += "<td>" + v.GroupName + "</td>";
                html1 += "<td><input type='checkbox'  class='chose-router'/></td>";
                html1 += "</tr>";

                //set option
                html2 += "<option value='" + v.IdGroup + "'>" + v.GroupName + "</option>";
            });
            $("#data-groupfindgprint").find("tbody").html(html);
            $("#data-grouplist").find("tbody").html(html1);
            $(".list-data-group").html(html2);
            choserouter();
        }
    });
};

function choserouter() {
    $(".chose-router").click(function () {
        var _this = $(this),
            val = _this.closest("tr").attr("data-id");
        if (!_this.is(":checked")) {
            _dataSetGroup = _dataSetGroup.replace(val + " ","");
        } else {
            _dataSetGroup += val + " ";
        }
    });
};

function ViewGroup(id) {
    sys.Loading();
    $.getJSON("/ConfigFindgprint/ViewGroup", { id: id }, function (data) {
        if (data != null) {
            var countp = data.length;
            $.each(data, function (k, v) {
                for (var i = 0; i < _markersfindgprintGroup.length; i++) {
                    var masker = _markersfindgprintGroup[i];
                    if (v.IdF === masker.id) {
                        masker.setIcon(_getColorFindGroup('black')); //ở file rp_simulation

                        if (k === 0 || k === (countp - 1)) {
                            var infowindow = new google.maps.InfoWindow({
                                content: v.Groupname
                            });
                            infowindow.open(MapmapGroupfindgprint, masker);
                        }                      
                        return;
                    }
                }
            });
        }
        sys.HideLoading();
    });
};

function DeleteGf(obj) {
    var _this = $(obj).closest("tr");
    if (confirm("Are you sure delete?")) {
        sys.Loading();
        $.getJSON("/ConfigFindgprint/DeleteGroupF", { id: _this.attr("data-id") }, function (data) {
            if (data != null) {
                _this.fadeOut("slow");
            }
            sys.HideLoading();
        });
    }   
};