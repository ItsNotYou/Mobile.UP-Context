define([
    'ADL',
    '../xapi-data/activities',
    'json!../xapi-data/verbs.json',
    './BaseSender',
    'moment'
], function(xapi, activities, verbs, StatementSender, moment) {

    StatementSender.prototype.sendHeartbeat = function() {
        var stmt = new xapi.ADL.XAPIStatement(
            this._agent,
            verbs.attended,
            activities.heartbeat()
        );
        stmt.timestamp = moment().toISOString();

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
