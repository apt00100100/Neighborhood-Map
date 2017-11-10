(function () {
    /**
     =======================================================
            View Model
     =======================================================
     */
    var ViewModel = function() {
        var self = this;
        var hotSpots = Model.hot_spots.slice(0);

        /**
         * Initialize
         * ==============================================
         */
        this.listOfSearchLocations = ko.observableArray(hotSpots);
        this.toggleMarkerInformation = toggleMarkerInformation;

        initialize();

        /**
         * Function Declarations
         * ==============================================
         */

        function initialize() {

            // Initialize view map
            //
            View.initMap({
                center: Model.start_location,
                styles: Model.map_styles_dark,
                zoom: Model.initial_zoom
            });

            // Initialize view markers
            //
            View.initMarkers(hotSpots);

            // Add event listeners
            //
            var markers = View.markers;
            var i, n = markers.length;
            for (i = 0; i < n; ++i) { markers[i].addListener('click', toggleMarkerInformation.bind(this, markers[i].id)); }
            // Toggle the slider window in/out
            View.showAreaButtonElem.addEventListener('click', View.toggleIsSliderWindowOpen);
            // Clear the info window marker data
            View.mainInfoWindow.addListener('closeclick', View.closeMainInfoWindow.bind(View));
            // Filter the list view by user input
            View.searchBoxInputElem.addEventListener('input', function (event) {
                filterMarkersByText(event.target.value.toString());
            });
        }

        /**
         * This method is called when the user clicks on a marker in the map, or an item in the list view.
         * @param id - google maps place_id
         */
        function toggleMarkerInformation(id) {

            // If the same marker is toggled, close the info window
            if (View.mainInfoWindow.marker) {
                var oldId = View.mainInfoWindow.marker.id;

                View.closeMainInfoWindow();

                // The same location has been clicked (BAIL!!)
                if (oldId === id) { return; }
            }

            var marker = View.markers.filter(function (m) { return m.id === id; })[0] || null;
            var foursquareConfig = {
                title: marker.title || '',
                photo: null,
                timeframes: []
            };

            if (!marker) {
                console.warn('Unable to locate marker with ID:', id);
                return;
            }

            View.displayMarkers([ marker ], false);
            View.bounceMarker(marker);

            // Welcome to callback hell...
            // ==>

            // 1. Request VenueID (this is needed for all further requests)
            requestFoursquareAPIVenueId(marker, function (data) {

                if (!data) {
                    View.displayMarkerDetails_Foursquare(marker, null);
                    return;
                }

                var venueID = data.venues[0].id;

                // 2. Request photos
                requestFoursquareAPIPhotos(venueID, function (data) {

                    if (!data) {
                        View.displayMarkerDetails_Foursquare(marker, null);
                        return;
                    }

                    if (data.photos.count > 0) {
                        foursquareConfig.photo = data.photos.items[0];
                    }

                    // 3. Request location hours
                    requestFoursquareAPIVenueHours(venueID, function (data) {

                        if (!data) {
                            View.displayMarkerDetails_Foursquare(marker, null);
                            return;
                        }

                        if (data.popular && data.popular.timeframes && data.popular.timeframes.length > 0) {
                            foursquareConfig.timeframes = data.popular.timeframes.slice(0);
                        }

                        View.displayMarkerDetails_Foursquare(marker, foursquareConfig);
                    });
                });
            });
        }

        function requestFoursquareAPIVenueId(marker, callback) {
            $.ajax({
                url: 'https://api.foursquare.com/v2/venues/search?',
                dataType: 'json',
                data:
                'll=' + marker.position.lat() + ',' + marker.position.lng() +
                '&client_id=QGEPUHUJ03CJM1X53RM4US3LYLRPVEOGJDTS2AFXN1E51V2Z' +
                '&client_secret=JBSCOOFUEBLKPVBINQQ5P3EL5TZFRUE5FBXJD5F5ASDJYXYP' +
                '&limit=1' +
                '&v=20140806' +
                '&m=foursquare',
                async: true,
                error: function (e) {
                    console.error(JSON.stringify(e));
                    callback && callback(null);
                },
                success: function (data) {
                    callback && callback(data.response);
                }
            });
        }

        function requestFoursquareAPIPhotos(venueId, callback) {
            $.ajax({
                url: 'https://api.foursquare.com/v2/venues/' + venueId + '/photos?',
                dataType: 'json',
                data:
                'limit=5' +
                '&client_id=QGEPUHUJ03CJM1X53RM4US3LYLRPVEOGJDTS2AFXN1E51V2Z' +
                '&client_secret=JBSCOOFUEBLKPVBINQQ5P3EL5TZFRUE5FBXJD5F5ASDJYXYP' +
                '&v=20140806' +
                '&m=foursquare',
                async: true,
                error: function (e) {
                    console.error(JSON.stringify(e));
                    callback && callback(null);
                },
                success: function (data) {
                    callback && callback(data.response);
                }
            });
        }

        function requestFoursquareAPIVenueHours(venueId, callback) {
            $.ajax({
                url: 'https://api.foursquare.com/v2/venues/' + venueId + '/hours?',
                dataType: 'json',
                data: 'client_id=QGEPUHUJ03CJM1X53RM4US3LYLRPVEOGJDTS2AFXN1E51V2Z' +
                '&client_secret=JBSCOOFUEBLKPVBINQQ5P3EL5TZFRUE5FBXJD5F5ASDJYXYP' +
                '&v=20140806' +
                '&m=foursquare',
                async: true,
                error: function (e) {
                    console.error(JSON.stringify(e));
                    callback && callback(null);
                },
                success: function (data) {
                    callback && callback(data.response);
                }
            });
        }

        function filterMarkersByText(text) {

            if (text === '') {
                self.listOfSearchLocations(hotSpots);
                View.displayMarkers();
                return;
            }

            var filteredMarkers = View.markers.filter(function (marker) {
                return marker.title.toLowerCase().indexOf(text.toLowerCase()) > -1;
            });

            View.hideMarkers();
            View.displayMarkers(filteredMarkers);

            self.listOfSearchLocations(filteredMarkers.map(function (marker) {
                return marker.data;
            }));
        }
    };

    /**
     * Apply ViewModel class to window
     */
    this.ViewModel = ViewModel;

}).call(window);