/** --------------------------------------------------------------------------------------------------------------------
 *
 *  Util.js: Miscellaneous utility functions
 *
 *  Navizon Inc., 2011
 *
 *  Gianni Giorgetti
 *
 * -------------------------------------------------------------------------------------------------------------------*/
createNamespace('nvzits.util');

(function(){

    "use strict"
    // -----------------------------------------------------------------------------------------------------------------
    // Module variables
    // -----------------------------------------------------------------------------------------------------------------
    var MAC_REGEX = new RegExp(/^([0-9a-f]{2}([:-]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$|([0-9a-f]{12}$)/gi),
        PSEUDO_MAC_REGEX = new RegExp(/^([0-9a-z]{2}([:-]|$)){6}$|([0-9a-z]{4}([.]|$)){3}$|([0-9a-z]{12}$)/gi);

    // -----------------------------------------------------------------------------------------------------------------
    // Public functions
    // -----------------------------------------------------------------------------------------------------------------
    function getProperty(obj, prop){
        
        if (obj != null && obj.hasOwnProperty(prop) && obj[prop] != null){
            return obj[prop];
        } else {
            return null;
        }
    }
    
    function setValue(control, value){
        if (control.attr('type') === 'text') {
            control.val(value);
        } else {
            control.text(value);
        }
    }
    
    function getValue(control){
        if (control.attr('type') === 'text') {
            return control.val();
        } else {
            return control.text();
        }
    }
        
    function escapeHtml(str) {
        if (typeof str === "string"){
            return str.replace(/&/g,'&amp;').
            replace(/>/g,'&gt;').                                           
            replace(/</g,'&lt;').                                           
            replace(/"/g,'&quot;');
        } else {
            return str;
        }                                                                                  
    }
    
    function formatTime(msec){
        var days, hours, min, sec;
        
        days = Math.floor(msec / (24*60*60*1000));
        msec -= days * 24*60*60*1000;
        
        hours =  Math.floor(msec / (60*60*1000));
        msec -= hours *  60*60*1000;
        
        min = Math.floor(msec / (60*1000));
        msec -= min * 60*1000;
        
        sec = Math.floor(msec / 1000);
        
        if (days > 1) {
            return days + "days ago";
        } else if (days > 0){
            return days + "day ago";
        } else if (hours > 0) {
            return hours + "h" + min + "m ago"; 
        } else if (min > 0) {
            return min + "m" + sec + "s ago";
        } else {
            return sec + "s ago";
        }
    }

    function formatTimeApprox(msec){
        var days, hours, min, sec;

        days = Math.floor(msec / (24*60*60*1000));
        msec -= days * 24*60*60*1000;

        hours =  Math.floor(msec / (60*60*1000));
        msec -= hours *  60*60*1000;

        min = Math.floor(msec / (60*1000));
        msec -= min * 60*1000;

        sec = Math.floor(msec / 1000);

        if (days > 1) {
            return days + ' days';
        } else if (days > 0) {
            return '1 day and ' + hours + ' hours'
        } else if (hours > 0) {
            return hours + ' hours';
        } else if (min > 0) {
            return min + ' minutes';
        } else {
            return 'minute';
        }
    }

    function getCurrentTimeString(){
        var ind, str = new Date().toString();
        ind = str.indexOf('GMT');
        if (ind != -1){
            str = str.substring(0, ind - 1);
        }
        return str;
    }
    
    // Repositions a Google Map to display a set of nodes
    function repositionMap(map, nodes){
        var i, bounds = new google.maps.LatLngBounds();
        
        for (i in nodes){
            if (nodes[i].loc && nodes[i].loc.lat != null && nodes[i].loc.lng != null){
                bounds.extend(new google.maps.LatLng(nodes[i].loc.lat, nodes[i].loc.lng));  
            }
        }
        
        // Make sure the bound contains valid coordinates
        if (!bounds.isEmpty()){
            // Re-center map to fit all the nodes
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
            return true;
        } else {
            return false;
        }
    }
    
    // Accepts MAC addresses in four formats 
    // Valid formats (not case sensitive)
    //      1: 0072CF21EB14
    //      2: 00-72-CF-21-EB-14
    //      3: 00:72:CF:21:EB:14
    //      4: 0072.CF21.EB14 
    function validateMac(mac){
        var re, m;

        if (!mac || mac.length === 0) {
            return null;
        }

        if (mac[0] === 'u' || mac[0] === 'U') {
            // pseudo-mac
            PSEUDO_MAC_REGEX.lastIndex = 0;   // reset regular expression matcher
            m = PSEUDO_MAC_REGEX.exec(mac);
        } else {
            // regular mac
            MAC_REGEX.lastIndex = 0; // reset regular expression matcher
            m = MAC_REGEX.exec(mac);
        }

        if (m === null || m.index !== 0) {
            // Invalid MAC
            return null;
        } else {
            // Valid MAC - Remove non alphanumeric characters (".", ":", "-") and convert to uppercase
            return mac.replace(/\.|:|\-/g,'').toUpperCase();
        }
    }
    
    function formatMac(mac, separator){
        var vmac = validateMac(mac);
        var sep = separator || ':';
        if (vmac != null){
            vmac =  vmac[0] + vmac[1] + sep + vmac[2] + vmac[3] + sep +
                    vmac[4] + vmac[5] + sep + vmac[6] + vmac[7] + sep +
                    vmac[8] + vmac[9] + sep + vmac[10] + vmac[11];
            
        } 
        return vmac;
    }

    function validateEmail(email){
        if (email && email.length > 0 && jcv_checkEmail(email)){
            return email;
        } else {
            return null;
        }
    }

    // Validate an email address.  Reference: Sandeep V. Tamhankar (stamhankar@hotmail.com),
    // javascript.internet.com
    function jcv_checkEmail(emailStr) {
        if (emailStr.length == 0) {
            return true;
        }
        // TLD checking turned off by default
        var checkTLD=0;
        var knownDomsPat=/^(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum)$/;
        var emailPat=/^(.+)@(.+)$/;
        var specialChars="\\(\\)><@,;:\\\\\\\"\\.\\[\\]";
        var validChars="\[^\\s" + specialChars + "\]";
        var quotedUser="(\"[^\"]*\")";
        var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
        var atom=validChars + '+';
        var word="(" + atom + "|" + quotedUser + ")";
        var userPat=new RegExp("^" + word + "(\\." + word + ")*$");
        var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$");
        var matchArray=emailStr.match(emailPat);
        if (matchArray==null) {
            return false;
        }
        var user=matchArray[1];
        var domain=matchArray[2];
        for (i=0; i<user.length; i++) {
            if (user.charCodeAt(i)>127) {
                return false;
            }
        }
        for (i=0; i<domain.length; i++) {
            if (domain.charCodeAt(i)>127) {
                return false;
            }
        }
        if (user.match(userPat)==null) {
            return false;
        }
        var IPArray=domain.match(ipDomainPat);
        if (IPArray!=null) {
            for (var i=1;i<=4;i++) {
                if (IPArray[i]>255) {
                    return false;
                }
            }
            return true;
        }
        var atomPat=new RegExp("^" + atom + "$");
        var domArr=domain.split(".");
        var len=domArr.length;
        for (i=0;i<len;i++) {
            if (domArr[i].search(atomPat)==-1) {
                return false;
            }
        }
        if (checkTLD && domArr[domArr.length-1].length!=2 && 
            domArr[domArr.length-1].search(knownDomsPat)==-1) {
            return false;
        }
        if (len<2) {
            return false;
        }
        return true;
    }
    
    function validateAlt(alt){
        var re, m;
        
        if (alt === '') {
            // empty values are fine
            return alt;
        }
        
        // If not an empty value, match the regular expression
        re = new RegExp(/^[+-]?\d{1,6}(\.\d{1,2})?$/gi);
        m = re.exec(alt);
        
        if (m == null || m.index != 0) {
            // Invalid alt
            return null;
        } else {
            // Valid alt
            return alt;
        }
    }
    
    function compareLatLng(latLng1, latLng2){
        if ((latLng1.lat().toFixed(6) == latLng2.lat().toFixed(6)) &&
            (latLng1.lng().toFixed(6) == latLng2.lng().toFixed(6))){
                return 0;
            }
            else {
                return 1;
            }
    }
    
    function arrayToMap(array, keyField){
        var i, key, len, map = {};
        
        if (array && array.length && array.length > 0){
            len = array.length;
            for (i = 0; i < len; i++){
                key = getProperty(array[i], keyField);
                if (key != null){
                    map[key] = array[i];
                }
            }
        }
        return map;
    }
    
    function errorMsg(elementId, message){
        $(elementId).removeClass('ajax_success').addClass('ajax_error').text(message).show();
    }
    
    function successMsg(elementId, message){
        $(elementId).addClass('ajax_success').removeClass('ajax_error').text(message).show();
    }

    // Sorts an array of 'levels' objects by the 'levelId' field
    function sortLevels(levels) {
        var ids = [], hashMap = {}, ret = [], i, numLevels = levels.length;
        for (i = 0; i < numLevels; i++) {
            ids[i] = levels[i].levelId;
            hashMap[ids[i]] = levels[i];
        }
        // sort the ids
        ids.sort();
        for (i = 0; i < numLevels; i++) {
            ret.push(hashMap[ids[i]]);
        }
        return ret;
    }

    // Creates a set of <option></option> values from a set of levels. The HTML returned by this function can be used
    // as content for a level select control
    function getLevelsAsHtmlOptions(levels, sort) {
        var i, level, levelLabel, numLevels = levels.length, levelOptions = [], sLevels;

        // sort the levels, if necessary
        if (sort){
            sLevels = nvzits.util.sortLevels(levels);
        } else {
            sLevels = levels;
        }

        // Create the options for a select control
        for (i = 0; i < numLevels; i++) {
            level = sLevels[i];
            levelLabel = sprintf('L%d, %s', level.levelId, nvzits.util.getProperty(level, 'name'));
            levelOptions.push('<option value="' + level.levelId + '">' + levelLabel +'</option>');
        }
        return levelOptions.join('');
    }

    function getLevelDesc(level) {
        var levelId = getProperty(level, 'levelId'), name = getProperty(level, 'name');
        if (levelId == null && name == null) {
            return 'N/A'
        } else {
            if (name) {
                return name;
            } else {
                return 'Level ' + levelId;
            }
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Ajax Spinner Class
    // -----------------------------------------------------------------------------------------------------------------

    // Build an AjaxSpinner object connected to the user interface element '$element'
    function AjaxSpinner($element, defaultSuccessMsg){
        this._jqEl = $element;
        if (defaultSuccessMsg){
            this._defSuccessMsg = defaultSuccessMsg;
        } else {
            this._defSuccessMsg = null; 
        }
        
    }

    // Signals the beginning of an Ajax operation (makes the spinner appear on screen)
    AjaxSpinner.prototype.start = function(){
        this._jqEl.find('img').show();
        this._jqEl.find('span').hide();
    };
    
    // Signals the completion of an Ajax operation. No message reported
    AjaxSpinner.prototype.stop = function(){
        this._jqEl.find('img').hide();
    };

    // Signals the completion on an Ajax operation and report an error message
    AjaxSpinner.prototype.stopError = function(msg){
        this._jqEl.find('img').hide();
        this._jqEl.find('span').removeClass('ajax_success').addClass('ajax_error').text(msg).show();    
    };

    // Signals the completion on an Ajax operation and report a success message
    AjaxSpinner.prototype.stopSuccess = function(msg){
        var message;
        if (msg){
            message = msg;
        } else if (this._defSuccessMsg){
            message = this._defSuccessMsg;
        } else {
            message = '';
        }
        this._jqEl.find('img').hide();
        this._jqEl.find('span').addClass('ajax_success').removeClass('ajax_error').text(message).show();
    };

    // Makes the spinner disappear
    AjaxSpinner.prototype.clear = function(){
        this._jqEl.find('span').hide();
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Exported functions
    // -----------------------------------------------------------------------------------------------------------------
    nvzits.util.getProperty = getProperty;
    nvzits.util.setValue = setValue;
    nvzits.util.getValue = getValue;
    nvzits.util.escapeHtml = escapeHtml;
    nvzits.util.formatTime = formatTime;
    nvzits.util.formatTimeApprox = formatTimeApprox;
    nvzits.util.getCurrentTimeString = getCurrentTimeString;
    nvzits.util.repositionMap = repositionMap;
    nvzits.util.validateMac = validateMac;
    nvzits.util.validateEmail = validateEmail;
    nvzits.util.formatMac = formatMac;
    nvzits.util.validateAlt = validateAlt;
    nvzits.util.compareLatLng = compareLatLng;
    nvzits.util.arrayToMap = arrayToMap;
    nvzits.util.errorMsg = errorMsg;
    nvzits.util.successMsg = successMsg;
    nvzits.util.sortLevels = sortLevels;
    nvzits.util.getLevelsAsHtmlOptions= getLevelsAsHtmlOptions;
    nvzits.util.getLevelDesc = getLevelDesc;
    nvzits.util.AjaxSpinner = AjaxSpinner;
})();