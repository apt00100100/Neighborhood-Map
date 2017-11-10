(function () {
    /**
     =======================================================
            View
     =======================================================
     */
    this.View = {

        /**
         * HTML Element variable declaration
         */
        // <div> element; id=#map
        mapElem: null,

        // <div> element; id=#user-input-container
        sliderMenuWindowElem: null,

        // <input> element; id=#search-box-input
        searchBoxInputElem: null,

        // <ul> element; id=#list-of-locations
        listOfLocationsElem: null,

        // <div> element; id=#show-area-button
        showAreaButtonElem: null,

        /**
         * Google Maps Component variable declaration
         */
        mapComponent: null,

        mainInfoWindow: null,

        markers: [],

        selectedMarker: null,

        isSliderWindowOpen: false,

        initMap: function (mapConfig) {

            this.mapElem = document.getElementById('map');
            this.sliderMenuWindowElem = document.getElementById('slider-menu-window');
            this.searchBoxInputElem = document.getElementById('search-box-input');
            this.listOfLocationsElem = document.getElementById('list-of-locations');
            this.showAreaButtonElem = document.getElementById('show-area-button');

            this.mapComponent = new google.maps.Map(this.mapElem, mapConfig || {});
            this.mainInfoWindow = new google.maps.InfoWindow();
        },

        initMarkers: function (listOfSpots) {

            var marker, spot,
                i, n = listOfSpots.length;

            for (i = 0; i < n; ++i) {
                spot = listOfSpots[i];

                marker = new google.maps.Marker({
                    title: spot.title,
                    position: spot.location,
                    id: spot.place_id,
                    animation: google.maps.Animation.DROP
                });
                marker.data = spot;

                this.markers.push(marker);
            }

            this.displayMarkers();
        },

        hideMarkers: function (listOfMarkers) {

            if (!listOfMarkers) {
                listOfMarkers = this.markers.slice(0);
            }

            var i, n = listOfMarkers.length;
            for (i = 0; i < n; ++i) {
                listOfMarkers[i].setMap(null);
            }
        },

        displayMarkers: function (listOfMarkers, autoHideMarkers) {

            if (autoHideMarkers === undefined) {
                autoHideMarkers = true;
            }

            if (!listOfMarkers || !Array.isArray(listOfMarkers)) {
                listOfMarkers = this.markers.slice(0);
            }

            if (listOfMarkers.length === 0) {
                return;
            }

            if (autoHideMarkers) {
                this.hideMarkers();
            }

            var bounds = new google.maps.LatLngBounds(),
                i, n = listOfMarkers.length,
                marker;

            for (i = 0; i < n; ++i) {
                marker = listOfMarkers[i];
                marker.setMap(this.mapComponent);
                bounds.extend(marker.position);
            }

            this.mapComponent.fitBounds(bounds);

            if (listOfMarkers.length > 1) {
                this.mapComponent.setCenter(bounds.getCenter());
            }
            else {
                var centerPosition = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                this.mapComponent.setCenter(centerPosition);
                this.mapComponent.setZoom(16);
                this.offsetCenter(200, -400);
            }
        },

        displayMarkerDetails_Foursquare: function (marker, data) {

            var innerHTML = '<div>';

            if (!data) {
                innerHTML += '<p class="error-message">There was an issue contacting the Foursquare API.<br>Please restart and try again.</p>';
            }
            else {

                // Location title
                innerHTML += '<h2>' + data.title + '</h2>';

                // Photo of location
                if (data.photo) {
                    var photoSrc = data.photo.prefix + 300 + data.photo.suffix;
                    var photoAlt = 'Location image for ' + data.title;
                    innerHTML += '<img class="information-window-image" src="' + photoSrc + '" alt="' + photoAlt + '">';
                }

                // Popular times for the business
                if (data.timeframes.length > 0) {

                    innerHTML += '<br><br><br><div class="center"><h4>Popular Hours:</h4>';

                    var daysInOrder = data.timeframes.slice(0).sort(function (a, b) {
                        if (a.days[0] < b.days[0]) {
                            return -1;
                        }
                        if (a.days[0] > b.days[0]) {
                            return 1;
                        }
                        return 0;
                    });

                    var day, dayOfWeek, start, end,
                        i, n = daysInOrder.length;

                    for (i = 0; i < n; ++i) {
                        day = daysInOrder[i];
                        dayOfWeek = this.dayOfWeekByNumber(day.days[0]);
                        start = this.convert24HoursTo12(day.open[0].start);
                        end = this.convert24HoursTo12(day.open[0].end);
                        innerHTML += dayOfWeek + ': ' + start + ' - ' + end + '<br>';
                    }

                    innerHTML += '</div>';
                }
            }

            innerHTML += '<br><br><div class="center third-party-label">Information provided by Foursquare</div></div>';

            View.mainInfoWindow.marker = marker;
            View.mainInfoWindow.setContent(innerHTML);
            View.mainInfoWindow.open(View.mapComponent, marker);
        },

        toggleIsSliderWindowOpen: function () {

            this.isSliderWindowOpen = !this.isSliderWindowOpen;

            var timeToAnimate = this.isSliderWindowOpen ? 300 : 150;

            // var leftPx = Math.ceil( * 0.8);
            var leftPx = 370;
            $('#slider-menu-window').animate({
                left: (this.isSliderWindowOpen ? '+=' : '-=') + leftPx
            }, timeToAnimate);
        },

        bounceMarker: function (marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        },

        closeMainInfoWindow: function() {
            this.displayMarkers();
            this.mainInfoWindow.close();
            if (this.mainInfoWindow.marker) {
                this.mainInfoWindow.marker.setAnimation(null);
                this.mainInfoWindow.marker = null;
            }
        },

        /**
         * HELPER METHODS BELOW:
         * =================================================
         */

        offsetCenter: function (offsetXPx, offsetYPx) {
            var center = this.mapComponent.getCenter();
            var scale = Math.pow(2, this.mapComponent.getZoom());

            var worldCoordinateCenter = this.mapComponent.getProjection().fromLatLngToPoint(center);
            var pixelOffset = new google.maps.Point((offsetXPx/scale) || 0,(offsetYPx/scale) ||0);

            var worldCoordinateNewCenter = new google.maps.Point(
                worldCoordinateCenter.x - pixelOffset.x,
                worldCoordinateCenter.y + pixelOffset.y
            );

            var newCenter = this.mapComponent.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

            this.mapComponent.setCenter(newCenter);
        },

        dayOfWeekByNumber: function (value) {
            if (value < 1 || value > 7) { return ''; }

            return ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'][value - 1];
        },

        convert24HoursTo12: function (time) {
            var hour = parseInt(time.slice(0, 2));
            var abbr = hour >= 12 ? 'PM' : 'AM';
            hour = hour > 12 ? hour - 12 : hour;
            var minutes = time.slice(2);
            return hour + ':' + minutes + ' ' + abbr;
        }
    };

}).call(window);