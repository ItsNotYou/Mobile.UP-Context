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

    LocationWidget.prototype.queryGenerator = function(callback) {
        var finish = _.bind(function(result) {
            var response = new contactJS.ContextInformationList();
            response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
            this._sendResponse(response, callback);
        }, this);

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
    };

    return LocationWidget;
});
