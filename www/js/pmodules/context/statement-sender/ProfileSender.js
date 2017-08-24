define([
    'ADL',
    '../xapi-data/activities',
    'json!../xapi-data/verbs.json',
    '../xapi-data/context',
    './BaseSender'
], function(xapi, activities, verbs, context, StatementSender) {

    /**
     *
     * @param device
     * @param {string} device.uuid Device identifier
     * @param {string} device.language Device language in short form, e.g. "en-US" or "de-DE"
     * @param {string[]} device.phoneNumbers Device phone numbers
     */
    StatementSender.prototype.sendDeviceDetails = function(device) {
        var extensions = {};
        if (device.language) {
            extensions.languageCode = device.language;
        }
        if (device.phoneNumbers) {
            extensions.phoneNumbers = device.phoneNumbers;
        }

        var stmt = new xapi.ADL.XAPIStatement(
            this._agent,
            verbs.used,
            activities.device(device.uuid, extensions)
        );

        this._sendStatement(stmt);
    };

    /**
     *
     * @param location current user location
     * @param {number} location.latitude Latitude
     * @param {number} location.longitude Longitude
     * @param {number} location.accuracy Accuracy in meters
     */
    StatementSender.prototype.sendUserLocation = function(location) {
        var stmt = new xapi.ADL.XAPIStatement(
            this._agent,
            verbs.wasat,
            activities.place(location)
        );

        this._sendStatement(stmt);
    };

    /**
     *
     * @param service
     * @param {string} service.provider "mail", "facebook" etc., must be known
     * @param {string} service.identity User name at the given provider
     */
    StatementSender.prototype.sendServiceLogin = function(service) {
        var stmt = new xapi.ADL.XAPIStatement(
            this._agent,
            verbs.loggedin,
            activities.service(service.provider, service.identity)
        );

        this._sendStatement(stmt);
    };

    return StatementSender;
});
