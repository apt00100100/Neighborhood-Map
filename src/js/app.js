(function () {
    /**
     =======================================================
            Entry Point
     =======================================================
     */
    this.initGoogleMap = function () {
        ko.applyBindings(new ViewModel());
    };

    this.errorLoadingGoogleMap = function () {
        $('#content').hide();
        $('#error').html('<h2>Something went wrong loading the google map.<br>Restart and try again.</h2>');
    };

}).call(window);