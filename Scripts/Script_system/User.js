var padinguser = null,
    padingusergroup = null,
    sttuser = 0,
    sttusergroup = 0;
$(document).ready(function () {
    _getUser();

    $(".btn-changePass").on("click", function(event) {
        event.preventDefault();
        var username = $(".fr-Username").val(),
            password = $(".fr-Password").val().trim(),
            passwordnew = $(".fr-Passwordnew").val().trim(),
            passwordconfirm = $(".fr-PasswordConfirm").val().trim();
        if (password === "") {
            sys.Alert("Message", "Enter password old!please", "Check");
            return false;
        }
        if (passwordnew === "") {
            sys.Alert("Message", "Enter new password !please", "Check");
            return false;
        }
        if (passwordconfirm === "") {
            sys.Alert("Message", "Enter confirm password !please", "Check");
            return false;
        }
        if (passwordconfirm !== passwordnew) {
            sys.Alert("Message", "Confirm password fail", "Check");
            return false;
        } else {
            var data = new Object();
            data.Username = username;
            data.Password = password;
            data.Phone = passwordnew; // set phone is password new
            $.when(sys.CallAjaxPost("/Home/ChangePassword", data)).done(function (change) {
                if (change === true) {
                    sys.Alert("Message", "Change completed!", "Done");
                    $(".fr-Password").val("");
                    $(".fr-Passwordnew").val("");
                    $(".fr-PasswordConfirm").val("");
                }                
                else
                    sys.Alert("Message", "Password old is incorrect", "Check");
            });
        }
    });

    $(".btn-user").on("click", function(event) {
        event.preventDefault();
        var username = $(".u-username").val().trim(),
            password = $(".u-password").val().trim(),
            fullname = $(".u-fullname").val().trim(),
            email = $(".u-email").val().trim(),
            phone = $(".u-phone").val().trim(),
            address = $(".u-address").val().trim(),
            usergroupid = $(".u-usergroup").find("option:selected").val(),
            IDuser = $("#IDuser").val();
        if (username === "") {
            sys.Alert("Message", "Enter username!please", "Check");
            return false;
        }
        if (fullname === "") {
            sys.Alert("Message", "Enter fullname!please", "Check");
            return false;
        }
        if (password === "") {
            sys.Alert("Message", "Enter password!please", "Check");
            return false;
        } else {
            var user = new Object();
            user.ID = IDuser;
            user.FullName = fullname;
            user.Username = username;
            user.Password = password;
            user.Phone = phone;
            user.Email = email;
            user.Address = address;
            user.Id_group_user = usergroupid;
            $.when(sys.CallAjaxPost("/User/AddorEdit", user)).done(function (addoredit) {
                if (addoredit === "Username") {             
                    sys.Alert("Message", "username  is existing", "check");
                    return false;
                }
                else if (addoredit === "Edit") {
                    sys.Alert("Message", "edit user is completed!", "done");
                    var update = $(".user" + IDuser);
                    update.find("td:eq(0)").html(fullname);
                    update.find("td:eq(3)").html(phone);
                    update.find("td:eq(4)").html(email);
                    update.find("td:eq(5)").html(address);
                    _clearUser();
                } else {
                    sttuser++;
                   //padinguser.row.add([sttuser, fullname, username, password, phone, email, address, _optiontableUser(addoredit)]).draw().nodes().to$().addClass('user' + addoredit);
                    user.ID = addoredit;
                    $("#data-user").find("tbody").prepend(autohtmlUser(user));
                    sys.Alert("Message", "add user is completed!", "done");

                    _clearUser();
                }                 
            });
        }
    });

    $(".btn-clearuser").click(function() {
        _clearUser();
    });    
});

//load user
function _getUser() {
    $.getJSON("/User/_getAlldata", {}, function(data) {
        //user
        var html = "";
        $.each(data, function (k, v) {
            html += autohtmlUser(v);
        });
        $("#data-user").find("tbody").html(html);
        $("#data-user").dataTable();
        //$("#data-user_length").remove();      
    });
};

function autohtmlUser(v) {
    var html = "";
    sttuser++;
    html += "<tr class='user" + v.ID + "' data-id-group='" + v.Id_group_user + "' data-id='" + v.ID + "'>";
    html += "<td> " + v.FullName + "</td>";
    html += "<td>" + v.Username + " </td>";
    html += "<td>" + v.Password + " </td>";
    html += "<td>" + v.Phone + " </td>";
    html += "<td>" + v.Email + " </td>";
    html += "<td>" + v.Address + " </td>";
    html += "<td>" + _optiontableUser(v.ID) + "</td>";
    html += "</tr>";
    return html;
};

//load infor
function _getinforUser(obj) {
    var update = $(obj).closest("tr"); 
    $(".u-fullname").val(update.find("td:eq(0)").html().trim());
    $(".u-username").val(update.find("td:eq(1)").html().trim());
    $(".u-password").val(update.find("td:eq(2)").html().trim());
    $(".u-phone").val(update.find("td:eq(3)").html().trim());
    $(".u-email").val(update.find("td:eq(4)").html().trim()); 
    $(".u-address").val(update.find("td:eq(5)").html().trim());
    $("#IDuser").val(update.attr("data-id"));
    $(".u-username").attr("readonly", "readonly");
    $(".u-usergroup").val(update.attr("data-id-group"));
    sys.OnTop();
};

function _deleteuser(obj) {
    var del = $(obj).closest("tr");
    if (confirm("Are you sure disable?")) {
        $.getJSON("/User/_disable", { id: $(obj).attr("data-id") }, function (deletes) {
            del.remove();
        });
    }
};

function _clearUser() {
$(".u-username").val("");
$(".u-password").val("");
$(".u-fullname").val("");
$(".u-email").val("");
$(".u-phone").val("");
$(".u-address").val("");
$(".u-username").removeAttr("readonly");
$("#IDuser").val("0");
};

function _optiontableUser(id) {
    return "<div class='btn-group btn-group-sm'><button onclick='_getinforUser(this)' data-placement='bottom' data-toggle='tooltip' data-original-title='Edit' class='js-edit btn btn-alt btn-primary' data-id='0'><i class='fa fa-edit'></i></button><button onclick='_deleteuser(this)' data-id='"+id+"' data-placement='bottom' data-toggle='tooltip' data-original-title='Delete' class='js-delete btn btn-alt btn-primary' data-id='0'><i class='fa fa-trash-o'></i></button></div>";
}