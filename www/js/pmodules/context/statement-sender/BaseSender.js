define([
    'ADL',
    '../xapi-data/activities',
    'json!../xapi-data/verbs.json',
    '../xapi-data/context',
    'Session',
    'jquery'
], function(xapi, activities, verbs, context, Session, $) {

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
     * Sends a xAPI statement to the designated LRS
     * @param stmt xAPI statement
     * @returns jQuery promise
     */
    StatementSender.prototype._sendStatement = function(stmt) {
        // TODO: Refine send queue
        var sendAgain = function(stmt, deferred) {
            xapi.ADL.XAPIWrapper.sendStatement(stmt, function(err, res, body) {
                if (err) {
                    // See res.status for details on failure
                    // 400 bei falschem Request
                    // 0 bei lokalem technischem Problem (keine Verbindung)
                    console.log("Send error: " + res.status + " / " + JSON.stringify(err));
                    sendAgain(stmt, deferred);
                } else {
                    result.resolve(body.id);
                }
            });
        };

        var result = $.Deferred();
        sendAgain(stmt, result);
        return result.promise();
    };

    return StatementSender;
});
