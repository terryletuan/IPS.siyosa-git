/**
* Replaces all instances form @param:'strTarget' to @param:'strSubString' of the given substring.
*
* @param: strTarget is string or array()
* @param: strSubString
*
**/
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
}

//format tien te
function formatMoney(num, fix) {

    if (num == 0) return num;

    var p = num.toFixed(fix);

    if (p < 1000) return (p + "").replace(".", ",");

    return p.split("").reverse().reduce(function (acc, num, i, orig) {
        return num + (i && !(i % 3) ? "." : "") + acc;
    }, "");
}

// form so sau khi lost focus
function formatNumber(obj) {
    obj = $(obj);
    var fix = 0;

    if (obj.attr('fix'))
        fix = parseInt(obj.attr('fix'));

    obj.keyup(function () {
        var v = obj.val();

        if (v.length == 0) return false;

        if (v.indexOf(',') > 0) return;

        v = v.replaceAll('.', '').replaceAll(',', '.');

        obj.val(formatMoney(parseFloat(v), fix));
    });
}