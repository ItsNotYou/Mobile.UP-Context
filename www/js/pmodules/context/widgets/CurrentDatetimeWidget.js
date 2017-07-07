define([
    'underscore',
    'contactJS',
    'ContextDescriptions',
    'moment'
], function(_, contactJS, ci, moment) {

    var CurrentDatetimeWidget = function(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = "CurrentDatetimeWidget";
        return this;
    };

    CurrentDatetimeWidget.prototype = Object.create(contactJS.Widget.prototype);
    CurrentDatetimeWidget.prototype.constructor = CurrentDatetimeWidget;

    CurrentDatetimeWidget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    CurrentDatetimeWidget.description = {
        out: [ci.getRaw("CI_CURRENT_DATETIME")],
        const: [{ name: "", type: "" }],
        updateInterval: 1000 * 30 // twice per minute
    };

    CurrentDatetimeWidget.prototype.queryGenerator = function(callback) {
        var result = moment().format();

        var response = new contactJS.ContextInformationList();
        response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
        this._sendResponse(response, callback);
    };

    return CurrentDatetimeWidget;
});
