define([
    'underscore',
    'contactJS',
    'ContextDescriptions'
], function(_, contactJS, ci) {

    var DevicePhoneNumbersWidget = function(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = "DevicePhoneNumbersWidget";
        return this;
    };

    DevicePhoneNumbersWidget.prototype = Object.create(contactJS.Widget.prototype);
    DevicePhoneNumbersWidget.prototype.constructor = DevicePhoneNumbersWidget;

    DevicePhoneNumbersWidget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    DevicePhoneNumbersWidget.description = {
        out: [ci.getRaw("CI_DEVICE_PHONE_NUMBERS")],
        const: [{ name: "", type: "" }],
        updateInterval: 60 * 60 * 1000 // Once every hour
    };

    DevicePhoneNumbersWidget.prototype.queryGenerator = function(callback) {
        var finish = _.bind(function(result) {
            var response = new contactJS.ContextInformationList();
            response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
            this._sendResponse(response, callback);
        }, this);

        var finishUnknown = _.bind(function() {
            finish(contactJS.ContextInformation.VALUE_UNKNOWN);
        }, this);

        // Step 4: Filter data
        var filterData = function(cards) {
            cards.push({phoneNumber: "123456789"});

            var phoneNumbers = _.chain(cards)
                .pluck("phoneNumber")
                .filter(function(number) { return number})
                .map(function(number) { return "+49" + number; })
                .value();

            console.log("READ_PHONE_NUMBER: " + JSON.stringify(phoneNumbers));
            finish(phoneNumbers);
        };

        // Step 3: Get data -> go to filterData
        var getSimInfo = _.bind(function() {
            window.plugins.sim.getSimInfo(function(result) {
                if (result.cards) filterData(result.cards);
                else finishUnknown();
            }, finishUnknown);
        }, this);

        // Step 2: Request read permission -> go to getSimInfo
        var requestPermission = _.bind(function() {
            window.plugins.sim.requestReadPermission(getSimInfo, finishUnknown);
        }, this);

        // Step 1: Check read permission -> go to getSimInfo or requestPermission
        window.plugins.sim.hasReadPermission(function(hasPermission) {
            if (hasPermission) getSimInfo();
            else requestPermission();
        }, finishUnknown);
    };

    return DevicePhoneNumbersWidget;
});
