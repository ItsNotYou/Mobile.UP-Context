define([
    'ADL',
    '../xapi-data/activities',
    'json!../xapi-data/verbs.json',
    '../xapi-data/context',
    'Session',
    'jquery',
    '../SendQueue'
], function(xapi, activities, verbs, context, Session, $, SendQueue) {

    var StatementSender = function() {
        var session = new Session();
        if (!session.get('up.session.authenticated')) {
            throw {
                name: "LoginException",
                message: "User is not logged in",
                toString: function() { return this.name + ": " + this.message; }
            };
        }

        // Init send queue
        this._sendQueue = new SendQueue("context-send-queue");

        // Init user agent
        this._agent = new xapi.ADL.XAPIStatement.Agent('mailto:' + session.get("up.session.username") + '@uni-potsdam.de', session.get("up.session.username"));
    };

    /**
     * Sends a xAPI statement to the designated LRS
     * @param stmt xAPI statement
     * @returns jQuery promise
     */
    StatementSender.prototype._sendStatement = function(stmt) {
        return this._sendQueue.push(stmt, {});
    };

    return StatementSender;
});
