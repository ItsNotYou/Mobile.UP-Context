define([
    'contactJS',
    'ContextDescriptions'
], function(contactJS, ci) {

    var DeviceInfoWidget = function(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = "DeviceInfoWidget";
        return this;
    };

    DeviceInfoWidget.prototype = Object.create(contactJS.Widget.prototype);
    DeviceInfoWidget.prototype.constructor = DeviceInfoWidget;

    DeviceInfoWidget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    DeviceInfoWidget.description = {
        out: [ci.getRaw("CI_DEVICE_INFO")],
        const: [{ name: "", type: "" }],
        updateInterval: 10000
    };

    DeviceInfoWidget.prototype.queryGenerator = function(callback) {
        var result = {
            uuid: "c7c7ba19-08e0-44d3-b91d-7b7b717484ed",
            language: "de-DE",
            phoneNumbers: ["+49172271235"]
        };

        var response = new contactJS.ContextInformationList();
        response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
        this._sendResponse(response, callback);
    };

    return DeviceInfoWidget;
});
