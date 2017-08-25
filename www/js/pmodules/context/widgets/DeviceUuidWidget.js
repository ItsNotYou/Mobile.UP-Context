define([
    'utils',
    'contactJS',
    'ContextDescriptions'
], function(utils, contactJS, ci) {

    var DeviceUuidWidget = function(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = "DeviceUuidWidget";
        return this;
    };

    DeviceUuidWidget.prototype = Object.create(contactJS.Widget.prototype);
    DeviceUuidWidget.prototype.constructor = DeviceUuidWidget;

    DeviceUuidWidget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    DeviceUuidWidget.description = {
        out: [ci.getRaw("CI_DEVICE_UUID")],
        const: [{ name: "", type: "" }],
        updateInterval: 60 * 60 * 1000 // Once every hour
    };

    DeviceUuidWidget.prototype.queryGenerator = function(callback) {
        var result = utils.getUniqueIdentifier();

        var response = new contactJS.ContextInformationList();
        response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
        this._sendResponse(response, callback);
    };

    return DeviceUuidWidget;
});
