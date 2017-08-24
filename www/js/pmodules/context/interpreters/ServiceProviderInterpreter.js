define([
    'underscore',
    'contactJS',
    'ContextDescriptions'
], function (_, contactJS, ci) {

    // Finds anystring@anystring.any with false positives like test@test@test.de
    var emailTester = /\S+@\S+\.\S+/;

    /**
     * An Android account as given by the cordova account plugin
     * @typedef {Object} Account
     * @property {string} type - account type, e.g. com.facebook.messenger
     * @property {string} name - account name, e.g. some mail or id
     */

    /**
     * A ServiceProvider account that identifies a user. Currently, the following providers are known: email, facebook, twitter, threema
     * @typedef {Object} ServiceProvider
     * @property {string} provider - provider type, e.g. facebook
     * @property {string} account - account name, e.g. some mail or id
     */

    /**
     * Finds all email addresses in name fields
     * @param {Account[]} accounts
     * @param {string} provider
     * @returns {ServiceProvider[]}
     */
    var findEmails = function(accounts, provider) {
        return _.chain(accounts)
            .pluck("name")
            .filter(function(name) { return emailTester.test(name); } )
            .uniq()
            .map(function(name) { return {provider: provider, account: name}; })
            .value();
    };

    /**
     * Finds all providers by a given type prefix
     * @param {Account[]} accounts
     * @param {string} provider
     * @param {string} prefix
     * @returns {ServiceProvider[]}
     */
    var findProvider = function(accounts, provider, prefix) {
        return _.chain(accounts)
            .filter(function(account) { return prefix === account.type })
            .map(function(account) { return {provider: provider, account: account.name}; })
            .uniq()
            .value()
    };

    var ServiceProviderInterpreter = function (discoverer) {
        contactJS.Interpreter.call(this, discoverer);
        this.name = "ServiceProviderInterpreter";
        return this;
    };

    ServiceProviderInterpreter.description = {
        in: [ci.getRaw("CI_REGISTERED_ACCOUNTS")],
        out: [ci.getRaw("CI_SERVICE_PROVIDER")]
    };

    ServiceProviderInterpreter.prototype = Object.create(contactJS.Interpreter.prototype);
    ServiceProviderInterpreter.prototype.constructor = ServiceProviderInterpreter;

    ServiceProviderInterpreter.prototype._interpretData = function (inContextInformation, outContextInformation, callback) {
        var accounts = inContextInformation.getValueForContextInformationOfKind(this.getInputContextInformation().getItems()[0]);

        var result = [];
        if (accounts === contactJS.ContextInformation.VALUE_UNKNOWN) {
            result = contactJS.ContextInformation.VALUE_UNKNOWN;
        } else {
            result = [];
            result = result.concat(findEmails(accounts, "email"));
            result = result.concat(findProvider(accounts, "facebook", "com.facebook.auth.login"));
            result = result.concat(findProvider(accounts, "twitter", "com.twitter.android.auth.login"));
            result = result.concat(findProvider(accounts, "threema", "ch.threema.app"));
        }

        var response = outContextInformation.getItems()[0];
        response.setValue(result);
        callback([response]);
    };

    return ServiceProviderInterpreter;
});
