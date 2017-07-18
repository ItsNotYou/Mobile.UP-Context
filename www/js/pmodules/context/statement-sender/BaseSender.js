define([
    'ADL',
    '../xapi-data/activities',
    'json!../xapi-data/verbs.json',
    '../xapi-data/context',
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

    return StatementSender;
});
