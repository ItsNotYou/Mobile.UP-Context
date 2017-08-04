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

        this._sendStatement(stmt);
    };

    return StatementSender;
});
