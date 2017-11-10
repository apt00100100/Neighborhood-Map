(function () {
    /**
     =======================================================
            Model
     =======================================================
     */
    this.Model = {

        start_location: {
            lat: 41.881832,
            lng: -87.623177
        },

        initial_zoom: 11,

        hot_spots: [
            {
                title: 'Lincoln Park Zoo',
                place_id: 'ChIJB5o6CWvTD4gR25QC-QbMQAk',
                location: {
                    lat: 41.921104,
                    lng: -87.633991
                }
            },
            {
                title: 'Wrigley Field',
                place_id: 'ChIJId-a5bLTD4gRRtbdduE-6hw',
                location: {
                    lat: 41.948447,
                    lng: -87.655342
                }
            },
            {
                title: 'Navy Pier',
                place_id: 'ChIJtTDqvE0rDogRocZTJHkILF0',
                location: {
                    lat: 41.891672,
                    lng: -87.607899
                }
            },
            {
                title: 'Gamekeepers, Tavern & Grill',
                place_id: 'ChIJVWv5LGvTD4gRjA7TeYIIpb4',
                location: {
                    lat: 41.918199,
                    lng: -87.638433
                }
            },
            {
                title: 'Reggies Chicago',
                place_id: 'ChIJVUmkEX0sDogRzm1DQOACx-g',
                location: {
                    lat: 41.853996,
                    lng: -87.626760
                }
            }
        ],

        map_styles_dark: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 13
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#144b53"
                    },
                    {
                        "lightness": 14
                    },
                    {
                        "weight": 1.4
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#08304b"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#0c4152"
                    },
                    {
                        "lightness": 5
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#0b434f"
                    },
                    {
                        "lightness": 25
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#0b3d51"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#146474"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#021019"
                    }
                ]
            }
        ]
    };
}).call(window);