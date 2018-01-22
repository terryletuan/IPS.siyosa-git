/*----------------------------------------------------------------------------------------------------------------------
 *  rss_model.js: Display a graph of the RSS model for a give site
 *
 *  Gianni Giorgetti
 *
 *  Navizon Inc, 2013
 *
 -------------------------------------------------------------------------------------------------------------------- */
createNamespace('nvzits.display_fingerprints');

(function(){
    "use strict"

    // -----------------------------------------------------------------------------------------------------------------
    // Module variables
    // -----------------------------------------------------------------------------------------------------------------
    var SERVER_URL = "",
        SERVER_URL = "https://its.navizon.com",
        MIN_RSS = -110,
        MAX_RSS = -30,
        DEFAULT_MARKER_SIZE = 5,
        DEFAULT_MARKER_OPACITY = 1,
        DEFAULT_MARKER_BORDER = 1,

        /* * The colormap below was created with MATLAB
        *
        *   clrs = colormap;
        *   for i = 1 : length(clrs)
        *       rgb = round(clrs(i,:) * 255);
        *       fprintf('[%d, %d, %d],', rgb(1), rgb(2), rgb(3));
        *   end
        *
        * */
        HEATMAP_CLRS = [
            [0, 0, 143],[0, 0, 159],[0, 0, 175],[0, 0, 191],[0, 0, 207],[0, 0, 223],[0, 0, 239],[0, 0, 255],
            [0, 16, 255],[0, 32, 255],[0, 48, 255],[0, 64, 255],[0, 80, 255],[0, 96, 255],[0, 112, 255],[0, 128, 255],
            [0, 143, 255],[0, 159, 255],[0, 175, 255],[0, 191, 255],[0, 207, 255],[0, 223, 255],[0, 239, 255],[0, 255, 255],
            [16, 255, 239],[32, 255, 223],[48, 255, 207],[64, 255, 191],[80, 255, 175],[96, 255, 159],[112, 255, 143],[128, 255, 128],
            [143, 255, 112],[159, 255, 96],[175, 255, 80],[191, 255, 64],[207, 255, 48],[223, 255, 32],[239, 255, 16],[255, 255, 0],
            [255, 239, 0],[255, 223, 0],[255, 207, 0],[255, 191, 0],[255, 175, 0],[255, 159, 0],[255, 143, 0],[255, 128, 0],
            [255, 112, 0],[255, 96, 0],[255, 80, 0],[255, 64, 0],[255, 48, 0],[255, 32, 0],[255, 16, 0],[255, 0, 0],
            [239, 0, 0],[223, 0, 0],[207, 0, 0],[191, 0, 0],[175, 0, 0],[159, 0, 0],[143, 0, 0],[128, 0, 0]];

    // -----------------------------------------------------------------------------------------------------------------
    // Module variables
    // -----------------------------------------------------------------------------------------------------------------
    var _tab = null,        // jQuery reference to the tab containing all the controls
        _map = null,        // Google Map
        _kmlLayer,          // Floor plan
        _fps = [],          // Array of fingerprints as returned by the server
        _stationMap = {},   // Object containing the MACs of the stations that captured the fingerprints
        _markers = [],      // Markers used to display an entry of each fp on the map
        _apMap = {},        // Access point map by MAC address _apMac[MAC] = {maxRss:, minRss, entries:}
        _fpsLatLng = [],    // Array with all the lat/lng pairs _fpsLatLng[i] = {lat:..., lng:...}
        _apTable = null,    // Table used to display AP info
        _currAP = null,     // Current AP being displayed
        _ouiResolver = null,
        _markerSize = DEFAULT_MARKER_SIZE,
        _markerOpacity = DEFAULT_MARKER_OPACITY,
        _markerBorderSize = DEFAULT_MARKER_BORDER,
        _username,                      // Navizon ITS Account
        _password,                      //
        _siteId,                        //
        _levelId,                       //
        _authorizationBase64,
        _ajaxSpinner,
        _levels = [],
        _floorplans = [],
        _levelRecords,
        _$siteLevels,
        _selectedLevelId;
    // -----------------------------------------------------------------------------------------------------------------
    // Public functions
    // -----------------------------------------------------------------------------------------------------------------
    function init() {
        var mapOptions;
        
        // Initialize controls
        _tab = $('body');

        // Google Maps
        mapOptions = {
            zoom: 2,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            tilt: 0,
            scaleControl: true
        };
        _map = new google.maps.Map(document.getElementById("map"), mapOptions);
       

        // Buttons
        _tab.find('#fetch_fps').click(_onShowButton);
        _tab.find('#update_markers').click(_onUpdateMarkers);
        _tab.find('#marker_size').val(DEFAULT_MARKER_SIZE);
        _tab.find('#marker_opacity').val(DEFAULT_MARKER_OPACITY);
        _tab.find('#marker_border').val(DEFAULT_MARKER_BORDER);

        // Access Point Table
        _apTable = _tab.find('#ap_table').dataTable({
            'aoColumns': [
                { 'sWidth': '80px' }, // Mac
                {  },                 // Manufactures
                { 'sWidth': '50px' }, // Max
                { 'sWidth': '50px' }, // Min
                { 'sWidth': '50px' }, // Delta
                { 'sWidth': '50px' }, // Entries
                { 'sWidth': '40px', 'bSortable' : false, 'sClass': 'center' }    // Display on map
            ],
            'bAutoWidth': false,
            'bJQueryUI': false,
            'iDisplayLength': 20
        });

        // Show button in the AP table
        $(document).on('click', '.apDisplay', function() {
            _onMetricCheckBoxClick(this);
        });

        _tab.find('#rssMax').click(function() {
            _onMetricCheckBoxClick(this);
        });

        // AJAX Spinner, Messages, and Errors
        _ajaxSpinner = _tab.find('#global_spinner');
        _ajaxSpinner.hide();

        $(document).ajaxError(function(event, request, settings, thrownerror) {
            _tab.find("#status").html("Error " + request.status + " requesting page " + settings.url + " " + thrownerror);
        });

        _tab.find('#status').click(function(){
            $(this).text('');
        });

        $(document).ajaxStart(function(){
            _ajaxSpinner.show();
        });

        $(document).ajaxStop(function(){
            _ajaxSpinner.hide();
        });

        _ouiResolver = nvzits.OuiResolver;
        _ouiResolver.init();

        // Populate form fields with saved values
        _retrieveItsCredentialFromStorage();

        // Edit floor plan when pressing enter
        $('#header').find('input').keypress(function(e) {
            if(e.which == 13) {
                _onShowButton();
            }
        });
        _$siteLevels = _tab.find('#site_levels');
        _$siteLevels.change(function() {
            console.log("site level change()");
            _selectedLevelId = $(this).val();
            _displaySelectLevel();
        });

        _tab.find('#map_size').click(function() {
            if ($(this).text() === 'enlarge') {
                $(this).text('reduce');
                _tab.find('#left_pane').attr('class', 'grid_8 alpha');
                _tab.find('#right_pane').attr('class', 'grid_4 omega');
                _apTable.fnSetColumnVis(3, 0);
                _apTable.fnSetColumnVis(4, 0);
                _apTable.fnSetColumnVis(5, 0);
            } else {
                $(this).text('enlarge');
                _tab.find('#left_pane').attr('class', 'grid_6 alpha');
                _tab.find('#right_pane').attr('class', 'grid_6 omega');
                _apTable.fnSetColumnVis(3, 1);
                _apTable.fnSetColumnVis(4, 1);
                _apTable.fnSetColumnVis(5, 1);
            }
        });

        _reloadItsCredentials();
        _removeCheckBoxSelection();
        _removeMarkers();
        _resetData();
        _tab.find('#num_aps').text('');
        if (_kmlLayer) {
            _kmlLayer.setMap(null);
        }
        _apTable.fnClearTable();
        _removeMarkers();
        _removeCheckBoxSelection();
        _fetchData();       
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Events
    // -----------------------------------------------------------------------------------------------------------------

    // Called when the user presses the 'Show' button
    function _onShowButton() {
        _reloadItsCredentials();
        _removeCheckBoxSelection();
        _removeMarkers();
        _resetData();
        _tab.find('#num_aps').text('');
        if (_kmlLayer) {
            _kmlLayer.setMap(null);
        }
        _apTable.fnClearTable();
        _removeMarkers();
        _removeCheckBoxSelection();
        _fetchData();
    }

    // Called when the user change the visual appearance of makers at the bottom of the map
    function _onUpdateMarkers(event) {
        var size = parseInt(_tab.find('#marker_size').val()),
            opacity = parseFloat(_tab.find('#marker_opacity').val()),
            border = parseFloat(_tab.find('#marker_border').val());

        // Check values
        if (opacity > 1) {
            opacity = 1;
        } else if (opacity < 0) {
            opacity = 0;
        }
        _markerSize = size;
        _markerOpacity = opacity;
        _markerBorderSize = border;
        // Refresh markers
        _displayApEntries(_currAP);
    }

    function _onMetricCheckBoxClick($checkbox) {
        _removeCheckBoxSelection();
        if ($checkbox.id === 'rssMax') {
            _currAP = 'rssMax';
        } else {
            _currAP = /ap_display_(\w+)/.exec($checkbox.id)[1];
        }
        _displayApEntries(_currAP);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Private functions
    // -----------------------------------------------------------------------------------------------------------------

    // Retrieves the levels and floorplan for a given site
    function _fetchData() {
        $.when(_fetchLevels(), _fetchFloorplans()).done(function(a1, a2){
            _levels = a1[0];
            _floorplans = a2[0];
            _processLevelsAndFloorplans(a1[0], a2[0]);
        });
    }

    // Clear data structures
    function _resetData() {
        _levels = [];
        _floorplans = [];
        _levelRecords = [];
        _selectedLevelId = null;
        _fps = [];
        _apMap = {};
        _stationMap = {};
        _fpsLatLng = [];
    }

    // Retrieve the levels associated to a site
    function _fetchLevels() {
        return _navizonItsGet(_getSiteUrl() + 'levels/')
    }

    // Retrieve the floorplans associated to a site
    function _fetchFloorplans() {
        return _navizonItsGet(_getSiteUrl() + 'floorplans/')
    }

    // Retrieve the fingerprint for a given level ID
    function _fetchFingerprints(levelId) {
        return _navizonItsGet(_getSiteLevelUrl(levelId) + 'fingerprints/')
    }

    // Fetch fingerprints once levels and floor plans are available
    function _processLevelsAndFloorplans() {
        $.each(_levels, function(index, level) {
            var levelId = level['levelId'];
            $.when(_fetchFingerprints(levelId)).done(function(fps) {
                var i;
                for (i = 0; i < _levelRecords.length; i++) {
                    if (levelId < _levelRecords[i].levelId)
                        break;
                }
                _levelRecords.splice(i, 0, {
                    levelId: levelId,
                    name: level['name'],
                    fps: fps,
                    kml:_getFloorplanKml(levelId)
                });
                if (_selectedLevelId === null && fps.length > 0) {
                    _selectedLevelId = levelId;
                    _displaySelectLevel();
                }
                _refreshLevelSelector();
            });
       });
    }

    // Retrieve the KML for a specific floor plans
    function _getFloorplanKml(levelId) {
        var i;
        for(i = 0; i < _floorplans.length; i++) {
            if (_floorplans[i].levelId == levelId) {
                return _floorplans[i].kmlAligned;
            }
        }
        return null;
    }

    // Display data for a level
    function _displaySelectLevel() {
        _removeCheckBoxSelection();
        _removeMarkers();
        $.each(_levelRecords, function(index, record) {
            if (record.levelId == _selectedLevelId) {
                _processFingerprints(record.fps);
                _displayFloorplan(record.kml);
            }
        });
    }

    // Display a floor plan on Google Map
    function _displayFloorplan(kmlUrl) {
        // Remove previous kml
        if (_kmlLayer) {
            _kmlLayer.setMap(null);
        }
        // Set new one
        _kmlLayer = new google.maps.KmlLayer({
            clickable: false,
            map: _map,
            suppressInfoWindows: true,
            url: kmlUrl
        });
        //_kmlLayer.setMap(_map);
        return;
    }

    // Populates the level selector
    function _refreshLevelSelector() {
        _$siteLevels.html('');
        $.each(_levelRecords, function(index, record) {
            _$siteLevels.append(sprintf('<option value=%d>Level %d, %s, %d fps</option>', record.levelId,
                record.levelId, record.name, record.fps.length));
            //console.log(sprintf('%d, %d fps', levelId, data.length));
        });
        if (_selectedLevelId !== null)
            _$siteLevels.val(_selectedLevelId);
    }

    // Processes the fingerprints returned by the server
    function _processFingerprints(fps) {
        var i, numFps = fps.length, j, numEntries, marker, lat, lng, mac, rss, numAps = 0, strongestRss, staLabel, $list;

        // Create a map of all the access points
        _fps = fps;
        _apMap = {};
        _fpsLatLng = [];
        _stationMap = {};
        _apMap['rssMax'] = {entries:[]}; // used to keep track of strongest APs

        for (i = 0; i < numFps; i++) {
            // Keep track of the devices uses to capture the fps
            if (!_stationMap[fps[i].station])
                _stationMap[fps[i].station] = 1;
            else
                _stationMap[fps[i].station]++;
            // fp location
            lat = fps[i].lat;
            lng = fps[i].lng;
            _fpsLatLng.push({lat: lat, lng: lng});
            strongestRss = -Infinity;
            for (j = 0, numEntries = fps[i].entries.length; j < numEntries; j++) {
                mac = fps[i].entries[j].ap;
                rss = fps[i].entries[j].rss;
                if (_apMap[mac]) {
                    _apMap[mac].maxRss = (rss > _apMap[mac].maxRss) ? rss : _apMap[mac].maxRss;
                    _apMap[mac].minRss = (rss < _apMap[mac].minRss) ? rss : _apMap[mac].minRss;
                    _apMap[mac].entries.push({lat: lat, lng: lng, rss: rss});
                } else {
                    numAps++;
                    _apMap[mac] = {maxRss: rss, minRss: rss, entries: [{lat: lat, lng: lng, rss: rss}]};
                }
                // Keep track of strongest RSS
                if (rss > strongestRss) {
                    strongestRss = rss;
                }
            }
            _apMap['rssMax'].entries.push({lat: lat, lng: lng, rss: strongestRss});
        }
        // Display labels
        _tab.find('#num_aps').text(sprintf('(%d APs)', numAps));

        // Display list of devices used for training
        $list = $('<ul>');
        $.each(Object.keys(_stationMap), function(index, mac) {
            $list.append($('<li>').append(sprintf('%s, %s, %d fps', mac, _ouiResolver.getCompanyName(mac.slice(0,6)), _stationMap[mac])));
        });
        _tab.find('#stations').html($list);

        _refreshAPTable();
    }

    // Display AP information on the table
    function _refreshAPTable() {
        var mac, row, rows = [];

        // Clear table content
        _apTable.fnClearTable();

        for (mac in _apMap) {
            if(_apMap.hasOwnProperty(mac) && mac !== 'rssMax') {
                row = [];
                row.push(mac);
                row.push(_ouiResolver.getCompanyName(mac.slice(0,6)));
                row.push(_apMap[mac].maxRss);
                row.push(_apMap[mac].minRss);
                row.push(_apMap[mac].maxRss - _apMap[mac].minRss);
                row.push(_apMap[mac].entries.length);
                // display
                row.push('<input id="ap_display_' + mac + '" class="apDisplay" type="checkbox"/>');
                rows.push(row);
            }
        }
        _apTable.fnAddData(rows);
    }

    // Returns the marker used to display the value of an entry for a particular fp
    function _getApMarker(rss) {
        var markerIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'white',
            fillOpacity: 0.1,
            scale: _markerSize,
            strokeColor: 'black',
            strokeWeight: _markerBorderSize
        };
        if (rss !== undefined && rss !== null) {
            // markerIcon.strokeColor =
            markerIcon.fillColor = _getApMarkerColor(rss);
            markerIcon.fillOpacity = _markerOpacity;
        }
        return markerIcon;
    }

    // Returns the color to be used for a marker based on the RSS of the AP. Result is returned as a string representing
    // a css color. Example 'rgb(255, 0, 128)';
    function _getApMarkerColor(rss) {
        var clrInd, numLevels = HEATMAP_CLRS.length, rgb;
        if (rss < MIN_RSS) {
            clrInd = 0;
        } else if (rss > MAX_RSS) {
            clrInd = numLevels - 1;
        } else {
            clrInd = Math.round((numLevels - 1) * (rss - MIN_RSS) / (MAX_RSS - MIN_RSS));
        }
        rgb = HEATMAP_CLRS[clrInd];
        return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
    }


    function _saveItsCredentialsToStorage() {
        if( typeof(Storage) !== "undefined") {
            localStorage.its_username = _username;
            localStorage.its_site_id = _siteId;
            localStorage.its_level_id = _levelId;
        }
    }

    function _retrieveItsCredentialFromStorage() {
        if( typeof(Storage) !== "undefined") {
            _username = localStorage.its_username ? localStorage.its_username : '';
            _siteId = localStorage.its_site_id ? localStorage.its_site_id : '';
            _levelId = localStorage.its_level_id ? localStorage.its_level_id : '';
        }
        _tab.find('#username').val(_username);
        _siteId = _tab.find('#site_id').val(_siteId);
        _levelId = _tab.find('#level_id').val(_levelId);
    }

    // Reload the values of the Navizon I.T.S. account parameters
    function _reloadItsCredentials() {
        // Navizon ITS account
        _username = "Tuan.lequoc@siyosa.net";
        _password = "";
        _siteId = "1566";
        _levelId = "0";
        _authorizationBase64 = Base64.encode(_username + ':' + _password);
    }

    function _navizonItsGet(url) {
        return $.ajax({
            type: 'GET',
            url: url,
            beforeSend: function(jqXHR) {
                jqXHR.setRequestHeader("Authorization", "Basic " + _authorizationBase64);
            }
        });
    }

    function _getSiteUrl() {
        return SERVER_URL + '/api/v1/sites/' + _siteId + '/';
    }

    function _getSiteLevelUrl(levelId) {
        return SERVER_URL + '/api/v1/sites/' + _siteId + '/levels/' +  levelId + '/';
    }

    function _removeCheckBoxSelection() {
        // Clear previously selected AP
        if (_currAP) {
            if (_currAP === 'rssMax')
                _tab.find('#rssMax').removeAttr('checked');
            else
                _tab.find('#ap_display_' + _currAP).removeAttr('checked');
        }
        _currAP = null;
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Display metrics
    // -----------------------------------------------------------------------------------------------------------------

    // Shows the fingerprints for a given AP
    function _displayApEntries(mac) {
        _removeMarkers();
        _createEmptyMarkers();

        // Display Marker for current AP
        if (_apMap[mac]) {
            $.each(_apMap[mac].entries, function(ind, entry){
                var marker;
                marker =  new google.maps.Marker({
                    position: new google.maps.LatLng(entry.lat, entry.lng),
                    map: _map,
                    title: entry.rss.toString(),
                    icon: _getApMarker(entry.rss)
                });
                _markers.push(marker);
            });
        }
    }

    function _displayMaxRss() {
        _removeMarkers();
        _createEmptyMarkers();
        // Display Marker for current AP
        if (_apMap['rssMax']) {
            $.each(_apMap['rssMax'].entries, function(ind, entry){
                var marker;
                marker =  new google.maps.Marker({
                    position: new google.maps.LatLng(entry.lat, entry.lng),
                    map: _map,
                    title: entry.rss.toString(),
                    icon: _getApMarker(entry.rss)
                });
                _markers.push(marker);
            });
        }
    }

    function _removeMarkers() {
        // Remove previously selected markers
        if (_markers.length > 0) {
            // Delete markers
            $.each(_markers, function(index, marker){
                marker.setMap(null);
            });
        }
    }

    function _createEmptyMarkers() {
        // Display empty markers
        $.each(_fpsLatLng, function(ind, latlng){
            var marker;
            marker =  new google.maps.Marker({
                position: new google.maps.LatLng(latlng.lat, latlng.lng),
                map: _map,
                icon: _getApMarker(null)
            });
            _markers.push(marker);
        });
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Export Public functions
    // -----------------------------------------------------------------------------------------------------------------
    nvzits.display_fingerprints.init = init;

})();


