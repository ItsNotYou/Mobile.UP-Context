define([
    'underscore',
    'contactJS',
    'ContextDescriptions'
], function(_, contactJS, ci) {

    var RegisteredAccountsWidget = function(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = "RegisteredAccountsWidget";
        return this;
    };

    RegisteredAccountsWidget.prototype = Object.create(contactJS.Widget.prototype);
    RegisteredAccountsWidget.prototype.constructor = RegisteredAccountsWidget;

    RegisteredAccountsWidget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    RegisteredAccountsWidget.description = {
        out: [ci.getRaw("CI_REGISTERED_ACCOUNTS")],
        const: [{ name: "", type: "" }],
        updateInterval: 5 * 60 * 1000 // Once every five minutes
    };

    RegisteredAccountsWidget.prototype.queryGenerator = function(callback) {
        var finish = _.bind(function(result) {
            var response = new contactJS.ContextInformationList();
            response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
            this._sendResponse(response, callback);
        }, this);

        cordova.plugins.DeviceAccounts.get(function(accounts) {
            finish(accounts);
        }, function(error) {
            console.log('Fail to retrieve accounts, details on exception:' + JSON.stringify(error));
            finish(contactJS.ContextInformation.VALUE_UNKNOWN);
        });
    };

    return RegisteredAccountsWidget;
});
