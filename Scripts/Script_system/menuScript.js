
function activeMenu(obj) {

    $("#map_tracking").removeClass("dispay_none");
    if (!$("#map_tracking-realtime").hasClass("dispay_none"))
        $("#map_tracking-realtime").addClass("dispay_none");
    window.clearInterval(_timerTrackingRealtime);

    var _thismain = $(obj),
        key = _thismain.attr("data-key");
    //an truoc khi mo
    $(".menu-main").each(function() {
        var _this = $(this);
        if (!_this.hasClass("dispay_none")) {
            _this.addClass("dispay_none");
        }     
    });

    $("#page-content").css("display", "none");

    //active cai duoc chon
    $("." + key).removeClass("dispay_none");

    // chay findgprint
    if (key === "Fingerprints") {
        if ($("#map").html().trim() == "") {
            //bin chay fingerprint
            //load lai datatable
            $.ajax({
                url: '/Lib/jquery.dataTables.min.js',
                Type: 'GET',
                async: false,
                success: function (data) {
                    console.log("ok");
                }
            });

            //bin chay fingerprint
            nvzits.display_fingerprints.init();
        }
    }

    //show map report
    if (key === "bytrackedtag")
        initMapBytraced();
    else if (key === "Rp_By_group")
        initMapgroup();
    else if (key === "Rp_Comparetrackedtag")
        initComparetrackedtag();
    else if (key === "bytrackedtagami")
        initanimation();
    else if (key === "Rp_Simulation")
        initMapmapSimulation();
    else if (key === "GroupFindgprint")
        initMapmapGroupfindgprint();
    else if (key === "bytrackedtagF")
        initMapBytracedF();
    else if (key === "bytrackedtagF1")
        initMapBytracedF1();
    else if (key === "AutoFindAddress")
        initMapAuto();

}

function activeMenunone(obj) {
    //an truoc khi mo
    $(".menu-main").each(function () {
        var _this = $(this);
        if (!_this.hasClass("dispay_none")) {
            _this.addClass("dispay_none");
        }
    });

    $("#page-content").css("display","block");
}