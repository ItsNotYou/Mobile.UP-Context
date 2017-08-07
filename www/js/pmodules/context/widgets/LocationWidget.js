define([
    'underscore',
    'contactJS',
    './LocatorFilter',
    'AppEvents',
    'ContextDescriptions'
], function(_, contactJS, locators, appEvents, ci) {

    // Create locator once and wait for context events
    var locator = window.cordova ? new locators.NativeLocator() : new locators.BrowserLocator();
    appEvents.on("context_started", function() { locator.start(); }, this);
    appEvents.on("context_stopped", function() { locator.stop(); }, this);

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
        updateInterval: 1000 * 60 // once per minute
    };

    LocationWidget.prototype.queryGenerator = function(callback) {
        var finish = _.bind(function(result) {
            var response = new contactJS.ContextInformationList();
            response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
            this._sendResponse(response, callback);
        }, this);

        var location = locator.getPosition();
        if (location) {
            finish(location);
        } else {
            finish(contactJS.ContextInformation.VALUE_UNKNOWN);
        }

        /*
        var structure = {
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
        */
    };

    return LocationWidget;
});
