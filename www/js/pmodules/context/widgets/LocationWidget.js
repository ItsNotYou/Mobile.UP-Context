define([
    'underscore',
    'contactJS',
    'ContextDescriptions'
], function(_, contactJS, ci) {

    var LocationWidget = function(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = "LocationWidget";
        return this;
    };

    LocationWidget.prototype = Object.create(contactJS.Widget.prototype);
    LocationWidget.prototype.constructor = LocationWidget;

    LocationWidget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    LocationWidget.description = {
        out: [ci.getRaw("CI_USER_LOCATION")],
        const: [{ name: "", type: "" }],
        updateInterval: 1000 * 30 // twice per minute
    };

    LocationWidget.prototype.startGeoLocation = function() {
        // Get a reference to the plugin.
        var bgGeo = window.BackgroundGeolocation;

        //This callback will be executed every time a geolocation is recorded in the background.
        var callbackFn = _.bind(function(location, taskId) {
            this.lastKnownLocation = location;
            console.log('- Location: ', JSON.stringify(location));
            // Must signal completion of your callbackFn.
            bgGeo.finish(taskId);
        }, this);

        // This callback will be executed if a location-error occurs.  Eg: this will be called if user disables location-services.
        var failureFn = _.bind(function(errorCode) {
            console.warn('- BackgroundGeoLocation error: ', errorCode);
        }, this);

        bgGeo.on('location', callbackFn, failureFn);
        bgGeo.on('heartbeat', _.bind(function(params) {
            this.lastKnownLocation = params.location;
            console.log('- hearbeat');
        }, this));

        // BackgroundGeoLocation is highly configurable.
        bgGeo.configure({
            // Common Options
            desiredAccuracy: 1000,
            distanceFilter: 100,
            stopOnTerminate: false,
            startOnBoot: true,
            // iOS options
            useSignificantChangesOnly: true,
            preventSuspend: true,
            // Android Options
            foregroundService: true,
            // Logging & Debug Options
            debug: true,  // <-- Debug sounds & notifications.



            stationaryRadius: 25,

            // Activity Recognition config
            activityRecognitionInterval: 10000,
            stopTimeout: 5,
            // Application config


        }, function(state) {
            // This callback is executed when the plugin is ready to use.
            console.log("BackgroundGeolocation ready: ", state);
            if (!state.enabled) {
                bgGeo.start();
            }
        });
    };

    LocationWidget.prototype.queryGenerator = function(callback) {
        var finish = _.bind(function(result) {
            var response = new contactJS.ContextInformationList();
            response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
            this._sendResponse(response, callback);
        }, this);

        if (!this.geoLocationStarted) {
            this.startGeoLocation();
            this.geoLocationStarted = true;
        }

        var location = this.lastKnownLocation;
        if (location) {
            finish(location);
        } else {
            finish(contactJS.ContextInformation.VALUE_UNKNOWN);
        }

        /*
        // TODO: Implement
        var result = {
            coords: {
                latitude: 52.3936253,
                longitude: 13.1295858,
                altitude: null, // possibly null
                accuracy: 35.9, // in meters
                altitudeAccuracy: null, // possibly null
                heading: null, // in degrees. NaN if speed is 0, Possibly null
                speed: null // possibly null
            },
            timestamp: 123456789 // DOMTimeStamp, absolute or relative number of milliseconds
        };

        finish(result);
        */
    };

    return LocationWidget;
});
