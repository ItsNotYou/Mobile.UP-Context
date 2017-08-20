define([
    'jquery',
    'underscore',
    'ADL'
], function($, _, xapi) {

    var SendQueue = function(localStorageField) {
        // Init xAPI wrapper
        var conf = {
            endpoint: "http://lrs.soft.cs.uni-potsdam.de/data/xAPI/",
            auth: "Basic " + xapi.toBase64('f1e520976fb3cd27127bef0bfd2c4af924bfd2fc:b4f0955aea62c4d9f94a98e32a400e665f7338a7'),
            strictCallbacks: true
        };
        xapi.ADL.XAPIWrapper.changeConfig(conf);
    };

    SendQueue.prototype.push = function(statement, options) {

        var sendAgain = _.bind(function(statementWithOption) {
            this._send(statementWithOption).done().fail(sendAgain);
        }, this);

        sendAgain({
            statement: statement,
            options: options
        });
    };

    SendQueue.prototype._send = function(statementWithOption) {
        var result = $.Deferred();

        // TODO: Refine send queue for priorities
        // Check connectivity

        xapi.ADL.XAPIWrapper.sendStatement(statementWithOption.statement, function(err, res, body) {
            if (err) {
                // See res.status for details on failure
                // 400 on invalid request / statement
                // 0 on local technical problem (no connectivity)
                console.log("Send error: " + res.status + " / " + JSON.stringify(err));
                result.reject(statementWithOption);
            } else {
                // Details in body.id
                result.resolve(statementWithOption);
            }
        });

        return result.promise();
    };

    return SendQueue;
});
