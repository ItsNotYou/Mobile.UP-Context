define([
    'underscore',
    'contactJS',
    'ContextDescriptions'
], function(_, contactJS, ci) {

    var DeviceLanguageWidget = function(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = "DeviceLanguageWidget";
        return this;
    };

    DeviceLanguageWidget.prototype = Object.create(contactJS.Widget.prototype);
    DeviceLanguageWidget.prototype.constructor = DeviceLanguageWidget;

    DeviceLanguageWidget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    DeviceLanguageWidget.description = {
        out: [ci.getRaw("CI_DEVICE_LANGUAGE")],
        const: [{ name: "", type: "" }],
        updateInterval: 60 * 60 * 1000 // Once every hour
    };

    DeviceLanguageWidget.prototype.queryGenerator = function(callback) {
        var finish = _.bind(function(result) {
            var response = new contactJS.ContextInformationList();
            response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
            this._sendResponse(response, callback);
        }, this);

        if (window.cordova) {
            navigator.globalization.getPreferredLanguage(function(language) {
                finish(language.value);
            }, function() {
                finish(contactJS.ContextInformation.VALUE_UNKNOWN);
            });
        } else {
            finish(navigator.userLanguage || navigator.language);
        }
    };

    return DeviceLanguageWidget;
});
