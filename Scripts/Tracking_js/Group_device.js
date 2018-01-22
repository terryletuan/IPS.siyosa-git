var Data_device;
$(document).ready(function () {

    //bin load group device
    showdeviceforGroup();
    LoadGroupDevice();
    showdevice_new();
    

    $(".js-add-group").click(function () {
        loadtitleGroupdevice();
        Loadjs();
    });

    $(".js-add-device").click(function () {

        loadtitledevice();

        Loadjs();
    });


    //add or edit group device
    $(".btn-addGroup").on("click", function () {

        var mac = $("#Macgroup").val().trim(),
            name = $("#Namegroup").val().trim(),
            dec = $("#descgroup").val().trim(),
            GroupID = $("#GroupID").val();
        if (mac == "") {
            alert("Mac Group is not null!please");
            return;
        }
        if (name == "") {
            alert("Name Group is not null!please");
            return;
        }
        else {
            $.getJSON("/Trackings/AddorEdit", { mac: mac, name: name, dec: dec, GroupID: GroupID }, function (data) {
                if (data != "") {
                    if (data == "Trung")
                        alert("Mac group is exist! pls change");
                    else {
                        LoadGroupDevice(); //load group device
                        $("#myModal").modal('toggle'); // close modal bootstrap.
                    }

                }
            })
        }
    });

    // add or edit device of group
    $(".btn-adddevice").on("click", function () {
        var Device_mac = $(".List-device").find("option:selected").val(),
            Group_mac = $(".List-device-group").find("option:selected").val(),
            DeviceID = $("#DeviceID").val();
        $.getJSON("/Trackings/AddoreditDevice", { Device_mac: Device_mac, Group_mac: Group_mac, DeviceID: DeviceID }, function (data) {

            if(data != "")
            {
                if (data == "Trung")
                    alert("Device is exits, please change");
                else
                {
                    if (data != "Trueedit")
                        showdevice_new();
                    $("#myModal").modal('toggle'); // close modal bootstrap.
                }
            }
        })
    })
});

//show full devices of site
function showdeviceforGroup() {
    var _authorizationBase64, _username = "tuan.lequoc@siyosa.net", _password = "",
    url = "https://navimote2.navizon.com/api/v1/sites/1566/devices/?with=udo,status";
    _authorizationBase64 = Base64.encode(_username + ':' + _password);
    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Authorization", "Basic " + _authorizationBase64);
        },
        success: function (result) {

            //ghi data ra file
            Data_device = result;

        }
    });
}

//load js
function Loadjs() {
    //load lai datatable
    $.ajax({
        url: '/Scripts/bootstrap.min.js',
        Type: 'GET',
        async: false,
        success: function (data) {
            console.log("ok");
        }
    });

    $("#myModal").modal(); // show dialog.
};

//load list group device
function LoadGroupDevice() {
    $.getJSON("/Trackings/LoadGroupDevice", {}, function (data) {
        if (data != null) {
            var html = "", html1 = "";
            $.each(data, function (i, o) {
                html += "<tr class='Group-device-ls even' GroupID='" + o.ID_Group + "'>";
                html += "<td class='groupMac'> " + o.Mac_Group + "</td>";
                html += "<td class='groupName'> " + o.Name_Group + "</td>";
                html += "<td class='groupDec'>" + o.Description + " </td>";
                html += '<td> <div class="btn-group btn-group-sm"><button data-placement="bottom" data-toggle="tooltip" data-original-title="Edit" class="js-edit btn btn-alt btn-primary" onclick="loadGroupinfor(this)"><i class="fa fa-edit"></i></button></div> </td>';
                html += "</tr>";

                html1 += "<option value='" + o.ID_Group + "'> " + o.Name_Group + " </option>";
            });
            $(".main-group-device").html(html);
            $(".List-device-group").html(html1);
        }
    })
};

//load infor group
function loadGroupinfor(html) {
    var _this = $(html).closest(".Group-device-ls");
    $("#Macgroup").val(_this.find(".groupMac").html().trim());
    $("#Namegroup").val(_this.find(".groupName").html().trim());
    $("#descgroup").val(_this.find(".groupDec").html().trim());
    $("#GroupID").val(_this.attr("GroupID"));

    loadtitleGroupdevice();
    Loadjs();
};

function DeleteGroup(html) {
    var _this = $(html).closest(".Group-device-ls"),
        GroupID = _this.attr("GroupID");
    if (confirm("Are you sure delete?")) {
        $.getJSON("/Trackings/DeleteGroupDevice", { GroupID: GroupID }, function (data) {
            if (data != "") {
                if (data == "False")
                    alert("Can't Delete this group");
                else
                    _this.fadeOut("slow");
            }
        })
    }
};

//show full devices of site
function showdevice_new() {

    $.getJSON("/Trackings/LoadDevice", {}, function (data) {
        if (data != "") {
            var html = "";
            $.each(Data_device, function (i, o) {
                if (o.mac == mac) {
                    if (i % 2 == 0)
                        html += "<tr  role='row' class='even data-device' data-group-id='" + group_id + "' data-device-id='" + device_id + "' >";
                    else
                        html += "<tr  role='row' class='odd data-device' data-group-id='" + group_id + "' data-device-id='" + device_id + "'>";
                    html += "<td class='macdevice'>" + o.mac + " </td>";
                    html += "<td>" + o.udo.name + " </td>";
                    html += "<td>" + mac_group_name + " </td>";
                    if (o.position)
                        html += "<td> <a> <i class='gi gi-log_out'></i> " + o.position.lat + "," + o.position.lng + " </a></td>";
                    else
                        html += "<td> n/a</td>";
                    if (o.position) {
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
                    html += '<td> <div class="btn-group btn-group-sm"><button data-placement="bottom" data-toggle="tooltip" data-original-title="Edit" class="js-edit btn btn-alt btn-primary" onclick="loadGroupinfor_device(this)"><i class="fa fa-edit"></i></button><button data-placement="bottom" data-toggle="tooltip" data-original-title="Delete" class="js-delete btn btn-alt btn-primary" onclick="Deletedevice(this)"><i class="fa fa-trash-o"></i></button></div> </td>';
                    html += "</tr>";
                }
            });
            if (html != "") {
                $(".show-device-new").prepend(html);
            }
        }
    })
};

function _GetdeviceAPI(mac, mac_group_name, group_id, device_id) {
    //console.log(Data_device);
    if (Data_device != null || Data_device != "") {
        var html = "";
        $.each(Data_device, function (i, o) {
            if (o.mac == mac) {
                if (i % 2 == 0)
                    html += "<tr  role='row' class='even data-device' data-group-id='" + group_id + "' data-device-id='" + device_id + "' >";
                else
                    html += "<tr  role='row' class='odd data-device' data-group-id='" + group_id + "' data-device-id='" + device_id + "'>";
                html += "<td class='macdevice'>" + o.mac + " </td>";
                html += "<td>" + o.udo.name + " </td>";
                html += "<td>" + mac_group_name + " </td>";
                if (o.position)
                    html += "<td> <a> <i class='gi gi-log_out'></i> " + o.position.lat + "," + o.position.lng + " </a></td>";
                else
                    html += "<td> n/a</td>";
                if (o.position) {
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
                html += '<td> <div class="btn-group btn-group-sm"><button data-placement="bottom" data-toggle="tooltip" data-original-title="Edit" class="js-edit btn btn-alt btn-primary" onclick="loadGroupinfor_device(this)"><i class="fa fa-edit"></i></button><button data-placement="bottom" data-toggle="tooltip" data-original-title="Delete" class="js-delete btn btn-alt btn-primary" onclick="Deletedevice(this)"><i class="fa fa-trash-o"></i></button></div> </td>';
                html += "</tr>";
            }
        });
        if (html != "") {
            $(".show-device-new").prepend(html);
        }
    }
};

//load infor group
function loadGroupinfor_device(html) {
    var _this = $(html).closest(".data-device");
    $(".List-device").val(_this.find(".macdevice").html().trim());
    $(".List-device-group").val(_this.attr("data-group-id"));
    $("#DeviceID").val(_this.attr("data-device-id"));

    loadtitledevice();
    Loadjs();
};

//delete device
function Deletedevice(html) {
    if (confirm("Are you sure delete?")) {
        $.getJSON("/Trackings/DeleteDevice", { Device_mac: $(html).closest(".data-device").find(".macdevice").html().trim() }, function (data) {
            if (data != "") {
                _this.fadeOut("slow");
            }
        })
    }
};

function loadtitleGroupdevice() {
    $(".group-device-form").css("display", "block");
    $(".group-device-form1").css("display", "block");
    $(".device-form").css("display", "none");
    $(".device-form1").css("display", "none");
};

function loadtitledevice() {
    $(".group-device-form").css("display", "none");
    $(".group-device-form1").css("display", "none");
    $(".device-form").css("display", "block");
    $(".device-form1").css("display", "block");
};