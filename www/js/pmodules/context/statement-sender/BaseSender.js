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

    var deepMerge = function(target, source) {
        if ($.isArray(target)) {
            Array.prototype.push.apply(target, source);
            return;
        }

        for (var property in source) {
            if (target[property]) {
                deepMerge(target[property], source[property]);
            } else {
                target[property] = source[property];
            }
        }
    };

    /**
     * Adds Mobile.UP as statement source
     * @see {@link https://experienceapi.com/finding-source/} for details
     * @param statement
     * @private
     */
    StatementSender.prototype._addSource = function(statement) {
        deepMerge(statement, {"context": context.statement_source()});
    };

    /**
     * Sends a xAPI statement to the designated LRS
     * @param stmt xAPI statement
     * @returns jQuery promise
     */
    StatementSender.prototype._sendStatement = function(stmt) {
        this._addSource(stmt);
        return this._sendQueue.push(stmt, {});
    };

    return StatementSender;
});
