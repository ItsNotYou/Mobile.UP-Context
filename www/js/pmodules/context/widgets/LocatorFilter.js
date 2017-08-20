define([
    'underscore'
], function(_) {

    var NativeLocator = function () {};
    NativeLocator.prototype.constructor = NativeLocator;

    NativeLocator.prototype.start = function () {
        var bgGeo = window.BackgroundGeolocation;

        //This callback will be executed every time a geolocation is recorded in the background.
        var callbackFn = _.bind(function (location, taskId) {
            this._lastKnownLocation = location;
            console.log('- Location: ', JSON.stringify(location));
            // Must signal completion of your callbackFn.
            bgGeo.finish(taskId);
        }, this);

        // This callback will be executed if a location-error occurs.  Eg: this will be called if user disables location-services.
        var failureFn = _.bind(function (errorCode) {
            console.warn('- BackgroundGeoLocation error: ', errorCode);
        }, this);

        bgGeo.on('location', callbackFn, failureFn);
        bgGeo.on('heartbeat', _.bind(function (params) {
            this._lastKnownLocation = params.location;
            console.log('- hearbeat');
        }, this));

        // Prioritize battery life
        bgGeo.configure({
            // Common Options
            desiredAccuracy: 1000,
            distanceFilter: 100,
            stopOnTerminate: false,
            startOnBoot: true,
            // iOS options
            useSignificantChangesOnly: true,
            preventSuspend: true,
            // Android options
            foregroundService: true
        }, function (state) {
            // This callback is executed when the plugin is ready to use.
            console.log("BackgroundGeolocation ready: ", state);
            if (!state.enabled) {
                bgGeo.start();
            }
        });
    };

    NativeLocator.prototype.stop = function () {
        window.BackgroundGeolocation.stop();
    };

    NativeLocator.prototype.getPosition = function () {
        return this._lastKnownLocation;
    };

    var BrowserLocator = function () {};
    BrowserLocator.prototype.constructor = BrowserLocator;

    BrowserLocator.prototype.start = function () {
        var success = _.bind(function (position) {
            this._lastKnownPosition = position;
        }, this);

        var error = _.bind(function (err) {
            console.error('ERROR(' + err.code + '): ' + err.message);
        }, this);

        this._watchId = navigator.geolocation.watchPosition(success, error);
    };

    BrowserLocator.prototype.stop = function () {
        navigator.geolocation.clearWatch(this._watchId);
    };

    BrowserLocator.prototype.getPosition = function () {
        return this._lastKnownPosition;
    };

    return {
        NativeLocator: NativeLocator,
        BrowserLocator: BrowserLocator
    }
});