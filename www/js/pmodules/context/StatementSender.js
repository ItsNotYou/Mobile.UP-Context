define([
    'ADL',
    './xapi-data/activities',
    'json!./xapi-data/verbs.json',
    './xapi-data/context',
    'Session'
], function(xapi, activities, verbs, context, Session) {

    var StatementSender = function() {
        var session = new Session();
        if (!session.get('up.session.authenticated')) {
            throw {
                name: "LoginException",
                message: "User is not logged in",
                toString: function() { return this.name + ": " + this.message; }
            };
        }

        // Init xAPI wrapper
        var conf = {
            endpoint: "http://lrs.soft.cs.uni-potsdam.de/data/xAPI/",
            auth: "Basic " + xapi.toBase64('f1e520976fb3cd27127bef0bfd2c4af924bfd2fc:b4f0955aea62c4d9f94a98e32a400e665f7338a7'),
            strictCallbacks: true
        };
        xapi.ADL.XAPIWrapper.changeConfig(conf);

        // Init user agent
        this._agent = new xapi.ADL.XAPIStatement.Agent('mailto:' + session.get("up.session.username") + '@uni-potsdam.de', session.get("up.session.username"));
    };

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

        xapi.ADL.XAPIWrapper.sendStatement(stmt, function (err, res, body) {
            if (err) {
                console.error(err);
                return;
            }

            console.log("[" + body.id + "]: " + res.status + " - " + res.statusText);
        });
    };

    /**
     *
     * @param location current user location
     * @param {number} location.latitude Latitude
     * @param {number} location.longitude Longitude
     */
    StatementSender.prototype.sendUserLocation = function(location) {
        var stmt = new xapi.ADL.XAPIStatement(
            this._agent,
            verbs.wasat,
            activities.place(location)
        );

        // TODO: Add to send queue?
        xapi.ADL.XAPIWrapper.sendStatement(stmt, function (err, res, body) {
            if (err) {
                console.error(err);
                return;
            }

            console.log("[" + body.id + "]: " + res.status + " - " + res.statusText);
        });
    };

    /**
     *
     * @param course
     * @param {string} course.semester Course semester
     * @param {string} course.headerId Course header id as noted in university calendar
     */
    StatementSender.prototype.sendAttendedCourse = function(course) {
        var stmt = new xapi.ADL.XAPIStatement(
            this._agent,
            verbs.attended,
            activities.event(course)
        );
        stmt.context = context.attendance();

        console.log(stmt);

        // TODO: Add to send queue?
        xapi.ADL.XAPIWrapper.sendStatement(stmt, function(err, res, body) {
            if (err) {
                console.error(err);
                return;
            }

            console.log("[" + body.id + "]: " + res.status + " - " + res.statusText);
        });
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

        // TODO: Add to send queue?
        xapi.ADL.XAPIWrapper.sendStatement(stmt, function(err, res, body) {
            if (err) {
                console.error(err);
                return;
            }

            console.log("[" + body.id + "]: " + res.status + " - " + res.statusText);
        });
    };

    return StatementSender;
});
