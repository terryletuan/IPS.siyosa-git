var sys = (function () {

    var init, Success, Notsuccessfully,
        CheckMail, blockaccented,
        formatNumber, formatMoney, blockword,
        Alert, ConfirmDialog, CallAjax, CallAjaxasync, CallAjaxPost, CallAjaxExcel, CallAjaxPostasync,
        getDateString, Pageing, EncryptS, DecryptS, Loading,
        HideLoading, OptionTable, disButon, enButon, OnTop,
        SucessAlert, Pageing2, Pageing3, Pageing4, Pageing5, PageingExcel, Checkpermition, GetDatetime,NonPermition,
        _PageNumberAjax, _setSkip, _sizePageDefault;

    init = function () {
        var widthimg = 350;
        var widthscreem = $(window).width();
        var size = widthscreem / 2;
        var left = size - parseInt(175) + "px";

        //load dialog alert
        var leftdialog = size - parseInt(173) + "px";
        var dialog = "";
        dialog += "<div id='dialogcustom' style='width: 345px; height: auto; background-color:#00B050; border-radius: 5px;z-index: 9999999999;position: fixed;    border: 3px solid #D9534F;display:none;top:-160px;left:" + leftdialog + "'>";
        dialog += "<h1 id='data-title' style='text-align:center;color:white'>Thong bao</h1>";
        dialog += "<div id='data-content' style='height: auto; overflow: hidden;font-size:20px; color: white;text-align:center'></div>";
        //dialog += "<div id='data-button' style='text-align:center;'>";
        dialog += "<div id='data-button' style='text-align:center;'>";
        dialog += "<input type='button' id='data-ok' value='OK' style='display: inline-block; padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: normal; line-height: 1.428571429; text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; background-image: none; border: 1px solid transparent; border-radius: 4px; -webkit-user-select: none; color: #fff; background-color: #d9534f; border-color: #d43f3a; '/>";
        dialog += "</div>";
        dialog += "</div>";
        $("body").prepend(dialog);

        //load comfirm dialog
        var confirm = "";
        confirm += "<div id='dialogconfirm' style='width: 345px; height:auto; background-color:#00B050; border-radius: 5px;z-index: 9999999999;position: fixed;    border: 3px solid #D9534F;display:none;top:-160px;left:" + leftdialog + "'>";
        confirm += "<h1 id='data-title-confirm' style='text-align:center;color:white'>Thong bao</h1>";
        confirm += "<div id='data-content-confirm' style='height:auto;font-size:20px; overflow: hidden; color: white;text-align:center'></div>";
        confirm += "<div id='data-button' style='text-align:center'>";
        confirm += "<input type='button' id='data-yes' value='Yes' style='display: inline-block; padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: normal; line-height: 1.428571429; text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; background-image: none; border: 1px solid transparent; border-radius: 4px; -webkit-user-select: none; color: #fff; background-color: #d9534f; border-color: #d43f3a; '/>|";
        confirm += "<input type='button' id='data-no' value='No' style='display: inline-block; padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: normal; line-height: 1.428571429; text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; background-image: none; border: 1px solid transparent; border-radius: 4px; -webkit-user-select: none; color: #fff; background-color: #d9534f; border-color: #d43f3a; '/>";
        confirm += "</div>";
        confirm += "</div>";
        $("body").prepend(confirm);

        //load not successfully
        var leftsuccess = size - parseInt(200) + "px";
        var NotSuccess = "";
        NotSuccess += "<div id='dialogNotSuccess' style='width: 400px; height: 140px; background-color: rgb(92, 184, 92); border-radius: 5px;border: 2px solid #D9534F;z-index: 9999999999;position: fixed;display:none;top:-160px;left:" + leftsuccess + "''>";
        NotSuccess += " <div id='data-images' style='width:100px; height:100px;float:left'>";
        NotSuccess += " <img src='/Tool_JS/images/loading7_light_blue.gif' style='width:100px; height:100px' /></div>";
        NotSuccess += " <div id='data-content-NotSuccess' style='font-size:16px;;float: left; width:296px; height: 100px; line-height: 100px; font-size: 16px; overflow: hidden; color: white; text-align: center'>  </div>";
        NotSuccess += " <div id='data-button' style='text-align:center'>";
        NotSuccess += " <input type='button' id='data-NotSuccess' value='Yes'  style='display: inline-block; padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: normal; line-height: 1.428571429; text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; background-image: none; border: 1px solid transparent; border-radius: 4px; -webkit-user-select: none; color: #fff; background-color: #d9534f; border-color: #d43f3a; ' />";
        NotSuccess += "</div>";
        NotSuccess += "</div>";
        $("body").prepend(NotSuccess);

        //load  successfully
        var Success = "";
        Success += "<div id='dialogSuccess' style='width: 400px; height: 85px; background-color:rgb(92, 184, 92); border-radius: 5px;border: 2px solid #D9534F;z-index: 9999999999;position: fixed;display:none;top:-160px;left:" + leftsuccess + "''>";
        Success += " <div id='data-images' style='width:100px; height:100px;float:left'>";
        Success += " <img src='/Tool_JS/images/loading7_light_blue.gif' style='width:80px; height:80px' /></div>";
        Success += " <div id='data-content-Success' style='font-size:16px;;float: left; width:296px; height: 100px; line-height: 100px; font-size: 16px; overflow: hidden; color: #f7f3f3; text-align: center'>  </div>";
        Success += "</div>";
        $("body").prepend(Success);
    };

    //successfully
    Success = function (Content) {
        var objectinsert = $("#dialogSuccess");
        processAll(objectinsert);

        //set content thong bao
        $("#data-content-Success").text(Content);

        //định dạng cho text xuống dòng
        if (Content.length > 34) {
            $("#data-content-Success").css("line-height", "35px");
            $("#data-content-Success").css("height", 35 * (Content.length / 34));
            $("#dialogSuccess").css("min-height", "168px");
            $("#dialogSuccess").css("height", $("#dialogSuccess").height() + $("#data-content-Success").height() - 60);
        }
    };

    //Notsuccessfully
    Notsuccessfully = function (Content) {
        var objectinsert = $("#dialogNotSuccess");
        processAll(objectinsert);
        //set content thong bao
        $("#data-content-NotSuccess").text(Content);

        //định dạng cho text xuống dòng
        if (Content.length > 34) {
            $("#data-content-NotSuccess").css("line-height", "35px");
            $("#data-content-NotSuccess").css("height", 35 * (Content.length / 34));
            $("#dialogNotSuccess").css("min-height", "168px");
            $("#dialogNotSuccess").css("height", $("#dialogNotSuccess").height() + $("#data-content-NotSuccess").height() - 60);
        }

        //bin nut ok
        $("#data-NotSuccess").click(function () {
            //tra popup ve vi tri ban dau
            var heightscreem = $(window).height();
            var top = $(window).scrollTop();
            var truheigt = -((heightscreem / 3) + parseInt(top) + 150);

            objectinsert.animate({
                top: truheigt
            }, 500, function () { });

            //an di
            objectinsert.fadeOut();
        });
    };

    //ham xu ly insert,edit,delete
    function processAll(object) {
        //goiinsert
        object.fadeIn("slow");
        var heightscreem = $(window).height();
        var top = $(window).scrollTop();
        var iheight = heightscreem / 3 + parseInt(top);
        var truheigt = -((heightscreem / 3) + parseInt(top) + (-60));
        object.animate({
            top: iheight
        }, 500, function () {

            //delay 
            $(this).delay(1000);
            object.fadeOut(); // an truoc khi load.

            //tra popup ve vi tri ban dau
            $(this).animate({
                top: truheigt
            }, 500, function () { });
        });
    };

    //alert dialog
    Alert = function (Title, Content, Button) {

        //goi alert
        var object = $("#dialogcustom");
        object.fadeIn("slow");
        var heightscreem = $(window).height();
        var top = $(window).scrollTop();
        var iheight = heightscreem / 3 + parseInt(top) - 90;
        var truheigt = -((heightscreem / 3) + parseInt(top));
        object.css("top", iheight);

        //bin title, content, ok
        $("#data-title").text(Title);
        $("#data-content").text(Content);
        $("#data-ok").val(Button);

        //định dạng cho text xuống dòng
        if (Content.length > 34) {
            $("#dialogcustom").css("min-height", "200px");
            $("#dialogcustom").css("height", $("#dialogcustom").height() + $("#data-content").height() - 60);
        }

        //bin event click chuot
        $("#data-ok").on("click", function (event) {
            event.preventDefault();

            //tra popup ve vi tri ban dau
            var heightscreem = $(window).height();
            var top = $(window).scrollTop();
            var truheigt = -((heightscreem / 3) + parseInt(top) + 150);
            $("#dialogcustom").css("top", truheigt);

            //an di
            $("#dialogcustom").fadeOut();
        });
    };

    //confirm dialog
    ConfirmDialog = function (Title, Content, callback) {
        //goi alert
        var object = $("#dialogconfirm");
        object.fadeIn("slow");
        var heightscreem = $(window).height();
        var top = $(window).scrollTop();
        var iheight = (heightscreem / 3) + parseInt(top) / 5;
        object.css("top", iheight);
        //bin title, content,
        $("#data-title-confirm").text(Title);
        $("#data-content-confirm").text(Content);

        //định dạng cho text xuống dòng
        if (Content.length > 34) {
            $("#data-content-confirm").css("line-height", "35px");
            $("#data-content-confirm").css("height", 35 * (Content.length / 34));
            $("#dialogconfirm").css("min-height", "168px");
            $("#dialogconfirm").css("height", $("#dialogconfirm").height() + $("#data-content-confirm").height() - 60);
        }

        //bin event click chuot yes
        $("#data-yes").click(function () {
            bindialog();
            //bin chay su kien
            if (callback && typeof callback === 'function') {
                callback();
                return;
            }
        });

        //bin event click chuot no
        $("#data-no").click(function () {
            bindialog();
        });

        function bindialog() {
            //tra popup ve vi tri ban dau
            var heightscreem = $(window).height();
            var top = $(window).scrollTop();
            var truheigt = -((heightscreem / 3) + parseInt(top) + 150);

            //an di
            object.fadeOut();
            object.css("top", truheigt);
        }
    };

    //checkmail
    CheckMail = function (Email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(Email);
    };

    // chặn chử có dấu
    blockaccented = function (object) {
        object.keyup(function() {
            var check = /[^a-zA-Z0-9_-]/g;
            if (check.test(object.val())) {
                object.val(object.val().replace(/[^a-zA-Z0-9_-]/g, ''));
            }
        });
    };

    //chặn nhập chử
    blockword = function (object) {
        object.keyup(function() {
            var check = /[^0-9.]/;
            if (check.test(object.val())) {
                object.val(object.val().replace(/[^0-9.]/, ''));
            }
        });
    };

    //call ajax to get data
    CallAjax = function (URL, params) {
        return $.ajax({
            Type: "GET",
            url: URL,
            data: params,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    };

    //call ajax to get data
    CallAjaxPost = function (URL, params) {
        return $.ajax({
            url: URL,
            type: "POST",
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    };

    //call ajax to get data
    CallAjaxPostasync = function (URL, params) {
        return $.ajax({
            type: "POST",
            url: URL,
            data: params,
            dataType: 'json',
            contentType: false,
            processData: false,
            async: false
        });
    };

    //call ajax async
    CallAjaxasync = function (URL, params) {
        return $.ajax({
            Type: "GET",
            url: URL,
            data: params,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false
        });
    };

    //Call ajax upload excel file
    CallAjaxExcel = function(url, params) {
      return  $.ajax({
            type: "POST",
            url: url,
            data: params,
            dataType: 'json',
            contentType: false,
            processData: false
        });
    };

    //khai bao cho formatmoney và number
    String.prototype.replaceAll = function (strTarget, strSubString) {
        var strText = this;

        if ($.isArray(strTarget)) {
            strTarget.forEach(function (val, i) {
                strText = strText.replaceAll(val, strSubString);
            });
            return (strText);
        } else {
            var intIndexOfMatch = strText.indexOf(strTarget);

            // Keep looping while an instance of the target string
            // still exists in the string.
            while (intIndexOfMatch != -1) {
                // Relace out the current instance.
                strText = strText.replace(strTarget, strSubString)

                // Get the index of any next matching substring.
                intIndexOfMatch = strText.indexOf(strTarget);
            }

            // Return the updated string with ALL the target strings
            // replaced out with the new substring.
            return (strText);
        }
    };

    //formatMoney
    formatMoney = function (num, fix) {
        if (num == 0) return num;

        var p = num.toFixed(fix);

        if (p < 500) return (p + "").replace(".", ",");

        return p.split("").reverse().reduce(function (acc, num, i, orig) {
            return num + (i && !(i % 3) ? "." : "") + acc;
        }, "");
    };

    //format number
    formatNumber = function (obj) {
        obj = $(obj);
        var fix = 0;

        if (obj.attr('fix'))
            fix = parseInt(obj.attr('fix'));

        obj.keyup(function () {
            var v = obj.val();

            if (v.length === 0) return false;

            if (v.indexOf(',') > 0) return;

            v = v.replaceAll('.', '').replaceAll(',', '.');

            obj.val(formatMoney(parseFloat(v), fix));
        });
    };

    formatDateTime = function (_date, format) {
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
            "H+": getPaddedComp(date.getHours()), //hour
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

    //convert datetime to datetime
    formatDateTimeSQL = function (date) {
        var d = new Date(date.split("-").reverse().join("-"));
        var dd = d.getDate();
        var mm = d.getMonth() + 1;
        var yyyy = d.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        var datetime = yyyy + "-" + mm + "-" + dd;
        return datetime;
    }

    //Get datetime theo dinh dang format
    GetDatetime = function () {
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

        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }

    // phan trang table
    Pageing = function (object) {
        return object.dataTable();
    };

    // phan trang table khong sort
    Pageing2 = function (object) {
        return object.dataTable({
            "pagingType": "full_numbers",
            "order": [[1, "desc"]]
        });
    };

    // phan trang table full row
    Pageing3 = function (object) {
        return object.DataTable({
            "aLengthMenu": [
                [10000, -1],
                [10000, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 10000,
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ dòng",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [0]
            }
            ],
            "pagingType": "full_numbers"
        });
    };

    // phan trang table sort row dau tien, full row
    Pageing4 = function (object) {
        return object.DataTable({
            "aLengthMenu": [
                [10000, -1],
                [10000, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 10000,
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ dòng",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [0]
            }
            ],
            "pagingType": "full_numbers",
            "order": [[1, "desc"]]
        });
    };

    Pageing5 = function (object) {
        return object.DataTable({
            "aLengthMenu": [
                [20, 40, 60, -1],
                [20, 40, 60, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 20,
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ dòng",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [0]
            }
            ],
            "pagingType": "full_numbers",
            "order": [[0, "asc"]]
        });
    };

    PageingExcel = function (object) {
        return object.DataTable({
            "aLengthMenu": [
                [20, 40, 60, -1],
                [20, 40, 60, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 20,
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ dòng",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [0]
            }
            ],
            "pagingType": "full_numbers",
            dom: 'Bfrtip',
            buttons: [{
                extend: 'excelHtml5',
                customize: function (xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];

                    // jQuery selector to add a border
                    $('row c[r*="10"]', sheet).attr('s', '25');
                }
            }]
        });
    };

    //ma hoa javascript
    EncryptS = function (text) {
        var key = CryptoJS.enc.Utf8.parse('8080808080808080');
        var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

        var x = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        $(".CryptoJS").val(x); // class .CryptoJS duoc khai bao o trang layout
        var Contents = $(".CryptoJS").val();

        //clear gia tri khi get xong
        $(".CryptoJS").val("");
        return Contents; //tra ve du lieu da ma hoa.
    };

    // giai ma javascipt
    DecryptS = function (text) {
        //return CryptoJS.AES.decrypt(text, "My Secret Passphrase");
        var key = CryptoJS.enc.Utf8.parse('8080808080808080');
        return CryptoJS.AES.decrypt(text, key).toString(iv);
    };

    //loading trang
    Loading = function () {
        var height = $(window).height();
        var scrool = $(document).scrollTop();
        $("#loading").css("top", height / 3 + scrool);
        $("#loading").css("display", "block");
    };

    //hide load trang
    HideLoading = function () {
        $("#loading").fadeOut('slow');
        $("#loading").css("display", "none");
    };

    //vo hieu hoa button
    disButon = function (object) {
        $(object).attr('disabled', 'disabled');
    };

    //tat vo hieu hoa
    enButon = function (object) {
        $(object).removeAttr('disabled');
    };

    //len top
    OnTop = function () {
        $("html, body").animate({ scrollTop: 0 }, 'slow');
    };

    //thong bao cho cac table
    SucessAlert = function (title) {
        $(".messagealertmain").fadeIn();
        $(".messagealertmain").html("<i class='fa fa-check' style='color:#00ff21 !important;'></i><span class='messagealert' style='color:#242ef5 !important;'>" + title + "</span>").delay(5000).fadeOut();
    }

    //function mo rong
    OptionTable = function (Delete, Edit, View, IDobject, NameObject, NameDelete) {
        var objecthtml = "";
        objecthtml += "<button onclick='" + Delete + "' data-id='" + IDobject + "'  class='btn btn-danger btn-xs black btn-remove " + NameObject + "" + IDobject + "'><i class='fa fa-trash-o'></i><span class='namedelete_"+ IDobject +"'>" + NameDelete + "</span> | </button>";
        objecthtml += "<button onclick='" + Edit + "'  data-id='" + IDobject + "' class='btn btn-info btn-xs purple btn-edit'><i class='fa fa-wrench'></i> Sửa  | </button>";
        objecthtml += "<button onclick='" + View + "' data-id='" + IDobject + "' class='btn btn-success btn-xs purple btn-view'><i class='fa fa-edit'></i> Xem</button>";
        return objecthtml;
    };

    //check quyen he thong
    Checkpermition = function() {
        //var permitionall = $(".Fullpermition").val(),
        //    urlfull = window.location.href;

        //var keyadd = 0,
        //    keyedit = 0,
        //    keydelete = 0,
        //    keyview = 0;
        ////trang quan ly he thong

        //if (urlfull.indexOf("he-thong") !== -1) {

        //    if (urlfull.indexOf("quan-ly-buu-cuc") !== -1) {
        //        //quan ly buu cuc
        //        if (permitionall.indexOf("Add_qlbc") <= 0)
        //            keyadd = 1;
        //        if (permitionall.indexOf("Edit_qlbc") <= 0)
        //            keyedit = 1;
        //        if (permitionall.indexOf("Delete_qlbc") <= 0)
        //            keydelete = 1;
        //        if (permitionall.indexOf("View_qlbc") <= 0)
        //            keyview = 1;
        //    }         

        //    //quan ly phong ban
        //    if (urlfull.indexOf("quan-ly-phong-ban") !== -1) {
        //        if (permitionall.indexOf("Add_qlpb") <= 0)
        //            keyadd = 1;
        //        if (permitionall.indexOf("Edit_qlpb") <= 0)
        //            keyedit = 1;
        //        if (permitionall.indexOf("Delete_qlpb") <= 0)
        //            keydelete = 1;
        //        if (permitionall.indexOf("View_qlpb") <= 0)
        //            keyview = 1;
        //    }
            
        //    //quan ly nhan vien
        //    if (urlfull.indexOf("quan-ly-nhan-vien") !== -1) {
        //        if (permitionall.indexOf("Add_qlnv") <= 0)
        //            keyadd = 1;
        //        if (permitionall.indexOf("Edit_qlnv") <= 0)
        //            keyedit = 1;
        //        if (permitionall.indexOf("Delete_qlnv") <= 0)
        //            keydelete = 1;
        //        if (permitionall.indexOf("View_qlnv") <= 0)
        //            keyview = 1;
        //    }          

        //    //quan ly thay doi mat khau
        //    if (urlfull.indexOf("thay-doi-mat-khau") !== -1) {
        //        if (permitionall.indexOf("Edit_tdmk") <= 0)
        //            keyedit = 1;
        //        if (permitionall.indexOf("View_tdmk") <= 0)
        //            keyview = 1;
        //    }
           
        //} else if (urlfull.indexOf("quan-ly-danh-muc") !== -1) {
        //    //quan ly khach hang
        //    if (urlfull.indexOf("quan-ly-khach-hang") !== -1) {
        //        if (permitionall.indexOf("Add_qlkh") <= 0)
        //            keyadd = 1;
        //        if (permitionall.indexOf("Edit_qlkh") <= 0)
        //            keyedit = 1;
        //        if (permitionall.indexOf("Delete_qlkh") <= 0)
        //            keydelete = 1;
        //        if (permitionall.indexOf("View_qlkh") <= 0)
        //            keyview = 1;
        //    }        

        //    //quan ly doi tac
        //    if (urlfull.indexOf("quan-ly-doi-tac") !== -1) {
        //        if (permitionall.indexOf("Add_qldt") <= 0)
        //            keyadd = 1;
        //        if (permitionall.indexOf("Edit_qldt") <= 0)
        //            keyedit = 1;
        //        if (permitionall.indexOf("Delete_qldt") <= 0)
        //            keydelete = 1;
        //        if (permitionall.indexOf("View_qldt") <= 0)
        //            keyview = 1;
        //    }         

        //    //quan ly tinh thanh
        //    if (urlfull.indexOf("quan-ly-tinh-thanh-quoc-gia") !== -1) {
        //        if (permitionall.indexOf("Add_qltt") <= 0)
        //            keyadd = 1;
        //        if (permitionall.indexOf("Edit_qltt") <= 0)
        //            keyedit = 1;
        //        if (permitionall.indexOf("Delete_qltt") <= 0)
        //            keydelete = 1;
        //        if (permitionall.indexOf("View_qltt") <= 0)
        //            keyview = 1;
        //    }

        //    //quan ly tinh thanh
        //    if (urlfull.indexOf("quan-ly-tinh-thanh-quoc-gia") !== -1) {
        //        if (permitionall.indexOf("Add_qltt") <= 0)
        //            keyadd = 1;
        //        if (permitionall.indexOf("Edit_qltt") <= 0)
        //            keyedit = 1;
        //        if (permitionall.indexOf("Delete_qltt") <= 0)
        //            keydelete = 1;
        //        if (permitionall.indexOf("View_qltt") <= 0)
        //            keyview = 1;
        //    }

        //    //quan ly dong goi 
        //    if (urlfull.indexOf("quan-ly-dong-goi") !== -1) {
        //        if (permitionall.indexOf("Add_qldg") <= 0)
        //            keyadd = 1;
        //        if (permitionall.indexOf("Edit_qldg") <= 0)
        //            keyedit = 1;
        //        if (permitionall.indexOf("Delete_qldg") <= 0)
        //            keydelete = 1;
        //        if (permitionall.indexOf("View_qldg") <= 0)
        //            keyview = 1;
        //    }        

        //    //quan ly dich vu 
        //    if (urlfull.indexOf("quan-ly-dich-vu") !== -1) {
        //        if (permitionall.indexOf("Add_qldv") <= 0)
        //            keyadd = 1;
        //        if (permitionall.indexOf("Edit_qldv") <= 0)
        //            keyedit = 1;
        //        if (permitionall.indexOf("Delete_qldv") <= 0)
        //            keydelete = 1;
        //        if (permitionall.indexOf("View_qldv") <= 0)
        //            keyview = 1;
        //    }
            
        //    //quan ly bang gia
        //    if (urlfull.indexOf("quan-ly-bang-gia") !== -1) {
        //        if (permitionall.indexOf("Add_qlbg") <= 0)
        //            keyadd = 1;
        //        if (permitionall.indexOf("Edit_qlbg") <= 0)
        //            keyedit = 1;
        //        if (permitionall.indexOf("Delete_qlbg") <= 0)
        //            keydelete = 1;
        //        if (permitionall.indexOf("View_qlbg") <= 0)
        //            keyview = 1;
        //    }        
        //}

        //// chan phan truyen
        //if (keyadd === 1)
        //    sys.disButon($(".btn-addoredit"));
        //if (keyedit === 1)
        //    $(".btn-edit").remove();
        //if (keydelete === 1)
        //    $(".btn-remove").remove();
        //if (keyview === 1)
        //    $(".btn-view").remove();
    };

    NonPermition = function() {
        return $(".NonPermition").val();
    };

    //show so phan trang cho table ajax
    _PageNumberAjax = function (obj,currentPage, totalRow, sizePage, Search) {
        var row1 = Math.floor(totalRow / sizePage),
            row2 = totalRow % sizePage,
            displayPage = 4,
            key = "True",
            pageinfor = "",
            frompage = 0,
            prev = "",
            next = "",
            last = "";
        if (row2 > 0)
            row1++;

        // check neu page hien tai = 0
        if (currentPage === 0)
            currentPage = 1;

        //show page infor
        frompage = (sizePage * currentPage);
        if (frompage > totalRow)
            frompage = totalRow;
        if (currentPage === 1)
            pageinfor = "Từ " + 1 + " đến " + sizePage + " của " + totalRow + " mục ";
        else if (currentPage === 2)
            pageinfor = "Từ " + (sizePage + 1) + " đến " + frompage + " của " + totalRow + " mục ";
        else
            pageinfor = "Từ " + ((sizePage * (currentPage - 1)) + 1) + " đến " + frompage + " của " + totalRow + " mục ";
        obj.find(".page-infor").html(pageinfor);

        //check Next, Prev, last
        if (currentPage <= 1)
            prev = "disabled";
        if (row1 === 1 || currentPage === row1)
            next = "disabled";
        if (currentPage === row1)
            last = "disabled";

        //create html;
        var html = "";
        html += "<div class='dataTables_paginate paging_full_numbers' id=''>";
        html += "<a class='paginate_button first rowpage '  data-dt-idx='1' tabindex='0'>First</a>";
        html += "<a class='paginate_button prev rowpage " + prev + "'  data-dt-idx='" + (currentPage - 1) + "' tabindex='0' >Prev</a>";
        if (currentPage <= displayPage) { // xu ly 4 trang dau tien
            for (var i = 1; i <= row1; i++) {
                var current = "";
                if (i <= 5) {
                    if (i === currentPage)
                        current = "current";
                    html += "<a class='paginate_button rowpage " + current + "'  data-dt-idx='" + i + "'>" + i + "</a></span>";
                } else
                    break;
            }
        } else {
            var r1 = 0, r2 = 0, r3 = 0, r4 = 0;
            if ((currentPage + 2) === row1) { // trang kế trang cuối cùng 2 lan
                html += "<a class='paginate_button rowpage'  data-dt-idx='1'>1</a></span>";
                html += "<a class='paginate_button'>...</a></span>";
                html += "<a class='paginate_button rowpage'  data-dt-idx='" + (currentPage - 1) + "'>" + (currentPage - 1) + "</a></span>";
                html += "<a class='paginate_button rowpage current'  data-dt-idx='" + (currentPage) + "'>" + (currentPage) + "</a></span>";
                html += "<a class='paginate_button rowpage '  data-dt-idx='" + (currentPage + 1) + "'>" + (currentPage + 1) + "</a></span>";
                html += "<a class='paginate_button rowpage '  data-dt-idx='" + (currentPage + 2) + "'>" + (currentPage + 2) + "</a></span>";
                key = "false";
            }
            if ((currentPage + 1) === row1) { // trang kế trang cuối cùng
                html += "<a class='paginate_button rowpage'  data-dt-idx='1'>1</a></span>";
                html += "<a class='paginate_button'>...</a></span>";
                html += "<a class='paginate_button rowpage'  data-dt-idx='" + (currentPage - 2) + "'>" + (currentPage - 2) + "</a></span>";
                html += "<a class='paginate_button rowpage'  data-dt-idx='" + (currentPage - 1) + "'>" + (currentPage - 1) + "</a></span>";
                html += "<a class='paginate_button rowpage current'  data-dt-idx='" + (currentPage) + "'>" + (currentPage) + "</a></span>";
                html += "<a class='paginate_button rowpage '  data-dt-idx='" + (currentPage + 1) + "'>" + (currentPage + 1) + "</a></span>";
                key = "false";
            } else if (currentPage === row1) { // xu ly trang cuoi cung
                html += "<a class='paginate_button rowpage'  data-dt-idx='1'>1</a></span>";
                html += "<a class='paginate_button'>...</a></span>";
                html += "<a class='paginate_button rowpage'  data-dt-idx='" + (currentPage - 3) + "'>" + (currentPage - 3) + "</a></span>";
                html += "<a class='paginate_button rowpage'  data-dt-idx='" + (currentPage - 2) + "'>" + (currentPage - 2) + "</a></span>";
                html += "<a class='paginate_button rowpage'  data-dt-idx='" + (currentPage - 1) + "'>" + (currentPage - 1) + "</a></span>";
                html += "<a class='paginate_button rowpage current'  data-dt-idx='" + row1 + "'>" + row1 + "</a></span>";
                key = "false";
            }
            if (key === "True") { // kiem tra cac trang o giua
                html += "<a class='paginate_button rowpage'  data-dt-idx='1'>1</a></span>";
                html += "<a class='paginate_button'>...</a></span>";
                html += "<a class='paginate_button rowpage'  data-dt-idx='" + (currentPage - 1) + "'>" + (currentPage - 1) + "</a></span>";
                html += "<a class='paginate_button rowpage current'  data-dt-idx='" + (currentPage) + "'>" + (currentPage) + "</a></span>";
                html += "<a class='paginate_button rowpage'  data-dt-idx='" + (currentPage + 1) + "'>" + (currentPage + 1) + "</a></span>";
                html += "<a class='paginate_button'>...</a></span>";
                html += "<a class='paginate_button rowpage'  data-dt-idx='" + row1 + "'>" + row1 + "</a></span>";
            }
        }
        html += "<a class='paginate_button next rowpage " + next + "'  data-dt-idx='" + (currentPage + 1) + "' tabindex='0'>Next</a>";
        html += "<a class='paginate_button last rowpage " + last + "'  data-dt-idx='" + row1 + "' tabindex='0'>Last</a>";
        html += "</div>";

        // show so phan trang
        obj.find(".row-pageNumber").html(html);

        //bin onchange cho drowdowlist
        obj.find(".selectPageContent").on("change", function (event) {
            event.preventDefault();
            Search(0, parseInt($(this).find("option:selected").val()));
        });


        // bin click so phan trang
        obj.find(".rowpage").each(function () {
            var _this = $(this);
            if (!_this.hasClass("disabled")) {
                _this.click(function (event) {
                    event.preventDefault();
                    var sizePa = parseInt($(".selectPageContent").val());
                    Search(parseInt(_this.attr("data-dt-idx")), sizePa);
                });
            };
        });
    };

    _setSkip = function (currentPage) {
        //set skip
        var current = 0;
        if (currentPage >= 2)
            current = currentPage - 1;
        return current;
    };

    _sizePageDefault = function(obj) {
        return parseInt(obj.find(".selectPageContent").val());
    }

    //return ket qua
    return {
        init: init,
        Success: Success,
        Notsuccessfully: Notsuccessfully,
        CheckMail: CheckMail,
        blockaccented: blockaccented,
        formatNumber: formatNumber,
        blockword: blockword,
        Alert: Alert,
        ConfirmDialog: ConfirmDialog,
        formatDateTime: formatDateTime,
        CallAjax: CallAjax,
        CallAjaxPost: CallAjaxPost,
        CallAjaxPostasync:CallAjaxPostasync,
        CallAjaxasync: CallAjaxasync,
        CallAjaxExcel:CallAjaxExcel,
        Pageing: Pageing,
        Pageing2: Pageing2,
        Pageing3: Pageing3,
        Pageing4: Pageing4,
        Pageing5: Pageing5,
        PageingExcel:PageingExcel,
        EncryptS: EncryptS,
        DecryptS: DecryptS,
        Loading: Loading,
        HideLoading: HideLoading,
        OptionTable: OptionTable,
        disButon: disButon,
        enButon: enButon,
        OnTop: OnTop,
        Checkpermition:Checkpermition,
        SucessAlert: SucessAlert,
        formatDateTimeSQL: formatDateTimeSQL,
        GetDatetime: GetDatetime,
        NonPermition: NonPermition,
        _PageNumberAjax: _PageNumberAjax,
        _setSkip: _setSkip,
        _sizePageDefault: _sizePageDefault
    };
})();

// CSRF (XSRF) security
function addAntiForgeryToken(data) {
    //if the object is undefined, create a new one.
    if (!data) {
        data = {};
    }
    //add token
    var tokenInput = $('input[name=__RequestVerificationToken]');
    if (tokenInput.length) {
        data.__RequestVerificationToken = tokenInput.val();
    }
    return data;
};

//bin run
$(window).bind("load", function () {
    sys.init();
});
