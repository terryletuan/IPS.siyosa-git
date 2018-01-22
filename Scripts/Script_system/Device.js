$(document).ready(function () {
    _getdevice();
    // add or edit device of group
    $(".btn-device").on("click", function () {
        var devi = $(".List-device").find("option:selected"),
            grp = $(".List-device-group").find("option:selected");
            Device_mac = devi.val(),
            Device_name = devi.text(),
            Group_mac = grp.val(),
            Group_name = grp.text(),
            DeviceID = $("#DeviceID").val(),
            devicecolor = $(".device-color").attr("data-id"),
            remarks = $(".d-remarks").val();
        if (devicecolor === "") {
            sys.Alert("Message", "Chose Color! please", "Check");
            return false;
        } else {
            var Device = new Object();
            Device.Device_ID = DeviceID;
            Device.Device_mac = Device_mac;
            Device.Name = Device_name;
            Device.ID_Group = Group_mac;
            Device.IDColor = devicecolor;
            Device.Description = remarks;
            Device.Type = 1;
            $.when(sys.CallAjaxPost("/Device/_addOrEdit", Device)).done(function (addoredit) {
                if (addoredit === "Device_mac") {
                    sys.Alert("Message", "Device mac  is existing", "check");
                    return false;
                }
                else if (addoredit === "Color") {
                    sys.Alert("Message", "Color is existing! please change ", "check");
                    return false;
                }
                else if (addoredit === "Edit") {
                    sys.Alert("Message", "edit device is completed!", "done");
                    var update = $(".device_" + DeviceID);
                    update.find("td:eq(0)").html(Device_mac);
                    update.find("td:eq(1)").html(Device_name);
                    update.find("td:eq(2)").html(Group_name);
                    update.attr("data-id-group", Group_mac);
                    update.find("td:eq(3)").html($(".device-color").val());
                    update.attr("data-id-color", devicecolor);
                    update.find("td:eq(4)").html(remarks);
                    _clearDevice();
                    $("li." + Device_mac).attr("data-color", $(".device-color").val());
                } else {
                    
                    Device.Device_ID = addoredit;
                    Device.GroupName = Group_name;
                    $("#data-device").find("tbody").prepend(_autohtml(Device));
                    sys.Alert("Message", "add device is completed!", "done");
                    _clearDevice();
                }
            });
        }
    });
  
    $(".device-color").click(function () {
        $("ul.main-color").removeClass("display-none");
    });
});

function _getdevice() {
    $.getJSON("/Device/_getDevice", {}, function (data) {
        if (data.device !== null) {
            var html = "", htmltrackedreport = "";
            $.each(data.device, function (k, v) {
                html += _autohtml(v);

                //show for report
                htmltrackedreport += "<option data-mac='" + v.Device_mac + "' value='" + v.Device_ID + "'>" + v.Name + "</option>";
            });

            $(".bytrackedtag-device").html(htmltrackedreport);
            $(".comparetracked-device1").html(htmltrackedreport);
            $(".comparetracked-device2").html(htmltrackedreport);
            $(".bytrackedtag-deviceamini").html(htmltrackedreport);
            $(".Rp_logtime-device").html("<option data-mac='' value=''>All</option>" + htmltrackedreport);

            $("#data-device").find("tbody").html(html);
            $("#data-device").dataTable();
            //$("#data-device_length").remove();
        }

        if (data.color !== null) {
            var html = "";
            $.each(data.color, function (k, v) {
                html += "<li>";
                var cl = v.Color;
                if (cl === "Red")
                    html += "<div class='redcolor'></div>";
                else if (cl === "Blue")
                    html += "<div class='bluecolor'></div>";
                else if (cl === "Green")
                    html += "<div class='Greencolor'></div>";
                else if (cl === "Orange")
                    html += "<div class='Orangecolor'></div>";
                else
                    html += "<div style='margin-top: 2px;background-color:"+cl+"'></div>";
                html += " <div class='md5' data-id='" + v.ID + "'>" + cl + "</div>";
                html += "</li>";
            });
            $("ul.main-color").html(html);

            //bin click color
            $("ul.main-color li").click(function () {
                var value = $(this).find(".md5");
                $(".device-color").val(value.text());
                $(".device-color").attr("data-id", value.attr("data-id"));
                $("ul.main-color").addClass("display-none");
            });
        }
    });
};

function _autohtml(v) {
    var html = "";
    html += "<tr data-id-group='" + v.ID_Group + "' data-id-color='" + v.IDColor + "' data-id='" + v.Device_ID + "' class='device_" + v.Device_ID + " " + v.Device_mac + "'>";
    html += "<td>" + v.Device_mac + "</td>";
    html += "<td> " + v.Name + "</td>";
    html += "<td> " + v.GroupName + " </td>";
    html += "<td>" + v.Color + " </td>";
    html += "<td class='device_" + v.Device_mac + "'>50%</td>";
    html += "<td>" + v.Description + " </td>";
    html += "<td>" + _optiontabledevice() + "</td>";
    html += "</tr>";
    return html;
};

function _getColor() {
    $.getJSON("/Device/_getColor", {}, function (data) {
        if (data !== null) {
            var html = "";
            $.each(data, function(k, v) {
                html += "<li>";
                var cl = v.Color;
                if (cl === "Red")
                    html += "<div class='redcolor'></div>";
                else if (cl === "Blue")
                    html += "<div class='bluecolor'></div>";
                else if (cl === "Green")
                    html += "<div class='Greencolor'></div>";
                else if (cl === "Orange")
                    html += "<div class='Orangecolor'></div>";
                html += " <div class='md5' data-id='"+v.ID+"'>" + cl + "</div>";
                html += "</li>";
            });
            $("ul.main-color").html(html);

            //bin click color
            $("ul.main-color li").click(function () {
                var value = $(this).find(".md5");
                $(".device-color").val(value.text());
                $(".device-color").attr("data-id", value.attr("data-id"));
                $("ul.main-color").addClass("display-none");
            });
        }
    });
};

function _clearDevice() {
    $(".d-remarks").val("");
    $("#DeviceID").val("");
};

function _optiontabledevice() {
    return "<div class='btn-group btn-group-sm'><button onclick='_getinfordevice(this)' data-placement='bottom' data-toggle='tooltip' data-original-title='Edit' class='js-edit btn btn-alt btn-primary' data-id='0'><i class='fa fa-edit'></i></button><button onclick='_deletedevice(this)'  data-placement='bottom' data-toggle='tooltip' data-original-title='Delete' class='js-delete btn btn-alt btn-primary' data-id='0'><i class='fa fa-trash-o'></i></button></div>";
};

function _getinfordevice(obj) {
    var infor = $(obj).closest("tr");
    $(".List-device").val(infor.find("td:eq(0)").html());
    $(".List-device-group").val(infor.attr("data-id-group"));
    $("#DeviceID").val(infor.attr("data-id"));
    $(".device-color").val(infor.find("td:eq(3)").html());
    $(".device-color").attr("data-id", infor.attr("data-id-color"));
    $(".d-remarks").val(infor.find("td:eq(4)").html());
    sys.OnTop();
};

function _deletedevice(obj) {
    var del = $(obj).closest("tr");
    if (confirm("Are you sure disable?")) {
        $.getJSON("/Device/_disable", { id: del.attr("data-id") }, function (deletes) {
            del.remove();
        });
    }
};