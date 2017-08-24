define([
    'underscore',
    'contactJS',
    'ContextDescriptions'
], function(_, contactJS, ci) {

    // Finds anystring@anystring.any with false positives like test@test@test.de
    var emailTester = /\S+@\S+\.\S+/;

    /**
     * An Android account as given by the cordova account plugin
     * @typedef {Object} Account
     * @property {string} type - account type, e.g. com.facebook.messenger
     * @property {string} name - account name, e.g. some mail or id
     */

    /**
     * Finds all email addresses in name fields
     * @param {Account[]} accounts
     */
    var findEmails = function(accounts) {
        return _.chain(accounts)
            .pluck("name")
            .filter(function(name) { return emailTester.test(name); } )
            .uniq()
            .value();
    };

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
