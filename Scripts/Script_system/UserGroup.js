var padinguser = null,
    padingusergroup = null,
    sttuser = 0,
    sttusergroup = 0;
$(document).ready(function () {
    _getUserGroup();

    $(".btn-usergroup").on("click", function (event) {
        event.preventDefault();
        var mac = $(".ur-mac").val().trim(),
            name = $(".ur-name").val().trim(),
            dec = $(".ur-dec").val().trim(),
            idr = $(".ur-ud").val().trim(),
            permition = "";
        if (mac === "") {
            sys.Alert("Message", "Enter mac group! please", "Check");
            return false;
        }
        if (name === "") {
            sys.Alert("Message", "Enter name group! please", "Check");
            return false;
        }
        if (password === "") {
            sys.Alert("Message", "Enter password! please", "Check");
            return false;
        } else {

            //get permition
            $(".permitionall").each(function() {
                var _this = $(this);
                if (_this.is(":checked")) {
                    permition += _this.attr("id") + "/";
                } 
            });

            var userGroup = new Object();
            userGroup.ID = idr;
            userGroup.Code = mac;
            userGroup.Name = name;
            userGroup.Description = dec;
            userGroup.Type = 1;
            userGroup.Permition = permition;
            $.when(sys.CallAjaxPost("/UserGroup/AddorEdit", userGroup)).done(function (addoredit) {
                if (addoredit === "Code") {
                    sys.Alert("Message", "mac  is existing", "check");
                }
                else if (addoredit === "Edit") {
                    sys.Alert("Message", "edit user group is completed!", "done");
                    var update = $(".usergroup" + idr);
                    update.attr("data-permition", permition);
                    update.find("td:eq(0)").html(mac);
                    update.find("td:eq(1)").html(name);
                    update.find("td:eq(2)").html(dec);
                    _clearUserGroup();
                } else {
                    sys.Alert("Message", "add user group is completed!", "done");
                    userGroup.ID = addoredit;
                    $("#data-usergroup").find("tbody").prepend(autohtmlUserGroup(userGroup));
                    _clearUserGroup();
                }
            });
        }
    });

    $(".btn-clearusergroup").click(function () {
        _clearUserGroup();
    });
});

//load infor
function _getinforUserGroup(obj) {
    var update = $(obj).closest("tr");
    $(".ur-mac").val(update.find("td:eq(0)").html().trim());
    $(".ur-name").val(update.find("td:eq(1)").html().trim());
    $(".ur-dec").val(update.find("td:eq(2)").html().trim());
    $(".ur-ud").val(update.attr("data-id"));
    $(".ur-mac").attr("readonly", "readonly");
    sys.OnTop();

    $(".permitionall").each(function () {
        $(this).removeAttr("checked");
    });

    var permition = update.attr("data-permition");

    _clearpermition();//clear quyen truoc

    // show danh sach quyen vao list box
    $(".permitionall").each(function () {
        var _this = $(this), value = _this.attr("id");
        if (permition.indexOf(value) !== -1) {
            _this.prop("checked", true);
        }
    });

    sys.OnTop();
}

function _deleteuserGroup(obj) {
    var del = $(obj).closest("tr");
    if (confirm("Are you sure disable?")) {
        $.getJSON("/UserGroup/_disable", { id: del.attr("data-id") }, function (deldes) {
            del.remove();
        });
    }
};

function _getUserGroup() {
    $.getJSON("/UserGroup/_getUserGroup", {}, function (data) {
        //user
        var html1 = "", html2 = "";

        $.each(data, function (k, v) {
            sttusergroup++;
            html1 += autohtmlUserGroup(v);

            //show option
            html2 += "<option value='" + v.ID + "'>" + v.Name + " </option>";
        });

        //phan trang tam
        $("#data-usergroup").find("tbody").html(html1);
        $("#data-usergroup").dataTable();
        //$("#data-usergroup_length").remove();

        //show option
        $(".u-usergroup").html(html2);
    });
};

function autohtmlUserGroup(v) {
    var html = "";
    sttuser++;
    html += "<tr class='usergroup" + v.ID + "' data-id='" + v.ID + "' data-permition='" + v.Permition + "'>";
    html += "<td> " + v.Code + "</td>";
    html += "<td>" + v.Name + " </td>";
    html += "<td>" + v.Description + " </td>";
    html += "<td>" + _optiontableUserGroup(v.ID) + "</td>";
    html += "</tr>";
    return html;
};

function _clearUserGroup() {
    $(".ur-mac").val("");
    $(".ur-name").val("");
    $(".ur-ud").val("");
    $(".ur-dec").val("");
    $(".ur-mac").removeAttr("readonly");
    _clearpermition();
};

function _clearpermition() {
    $(".permitionall").each(function () {
        $(this).removeAttr("checked");
    });
}

function _optiontableUserGroup(id) {
    return "<div class='btn-group btn-group-sm'><button onclick='_getinforUserGroup(this)' data-placement='bottom' data-toggle='tooltip' data-original-title='Edit' class='js-edit btn btn-alt btn-primary' data-id='0'><i class='fa fa-edit'></i></button><button onclick='_deleteuserGroup(this)' data-id='" + id + "' data-placement='bottom' data-toggle='tooltip' data-original-title='Delete' class='js-delete btn btn-alt btn-primary' data-id='0'><i class='fa fa-trash-o'></i></button></div>";
}