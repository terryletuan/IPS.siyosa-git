/*----------------------------------------------------------------------------------------------------------------------
 *
 *  OuiResolver.js: Database of 'Organization Unique Id' to map from MAC address to manufacturer company name. The
 *  database is fetched remotely and saved in the local storage of the web browser.
 *
 *  Navizon Inc., 2013
 *
 *  Gianni Giorgetti
 *
 * -------------------------------------------------------------------------------------------------------------------*/
createNamespace('nvzits.OuiResolver');

(function() {
    "use strict";
    // -----------------------------------------------------------------------------------------------------------------
    // Module constants
    // -----------------------------------------------------------------------------------------------------------------
    var OUI_FILE = 'https://s3.amazonaws.com/navizon.its.resources/oui.json';

    // -----------------------------------------------------------------------------------------------------------------
    // Module variables
    // -----------------------------------------------------------------------------------------------------------------
    var _ouiMap = null;           // _ouiMap['001122'] = 'Company Name'

    // -----------------------------------------------------------------------------------------------------------------
    // Public Functions
    // -----------------------------------------------------------------------------------------------------------------
    function init() {
        _fetchOui();
    }

    // Returns true if the database has been loaded into memory
    function isDataLoaded() {
        return _ouiMap !== null;
    }

    // Returns the company id that matches the MAC address prefix or 'n/a' if no matches were found
    function getCompanyName(macPrefix) {
        var name = null;
        // Pseudo macs used in iOS v 7 and later
        if (macPrefix && macPrefix.length > 0 && macPrefix[0] === 'u' || macPrefix[0] === 'U') {
            return 'iOS 7+ device';
        }

        if (_ouiMap !== null) {
            name = _ouiMap[macPrefix];
        }
        return name ? name : 'n/a';
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Private Functions
    // -----------------------------------------------------------------------------------------------------------------

    // Load the database - try to use a previously saved version if available
    function _fetchOui() {
        var localDataAvailable = typeof(Storage) !== "undefined" && localStorage.ouiMapJson;
        if (localDataAvailable) {
            // Check if the data is up to date
            $.ajax({
                type: "HEAD",
                url: OUI_FILE,
                complete: function (XMLHttpRequest, textStatus) {
                    if (XMLHttpRequest.status == 200 && XMLHttpRequest.getResponseHeader('Last-Modified') !== localStorage.ouiMapLastModified) {
                        // File need to reloaded...
                        _fetchOuiFromNetwork();
                    } else {
                        // File is up to date or it was not possile to read the last-modified header. Keep local copy
                        _ouiMap = JSON.parse(localStorage.ouiMapJson);
                    }
                }
            });
        } else {
            _fetchOuiFromNetwork();
        }
    }

    // Retrieve the file containing the OUIs from the remote storage
    function _fetchOuiFromNetwork() {
        // Download the map
        var start = new Date();
        jQuery.get(OUI_FILE, function(data, textStatus, jqXHR) {
            _ouiMap = JSON.parse(data)
            // Save the map for the next time
            if (typeof(Storage) !== "undefined") {
                localStorage.ouiMapJson = data;
                localStorage.ouiMapLastModified = jqXHR.getResponseHeader('Last-Modified');
            }
        });
    }
    // -----------------------------------------------------------------------------------------------------------------
    // Export Public Functions
    // -----------------------------------------------------------------------------------------------------------------
    nvzits.OuiResolver.init = init;
    nvzits.OuiResolver.isDataLoaded = isDataLoaded;
    nvzits.OuiResolver.getCompanyName = getCompanyName;
})();