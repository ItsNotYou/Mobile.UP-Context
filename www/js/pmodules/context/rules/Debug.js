define([
    'underscore',
    'jquery',
    'contactJS',
    'ContextDescriptions',
    'StatementSender',
    '../ChangeAdapter'
], function (_, $, _contactJS, ci, StatementSender) {

    var context = {
        location: ci.get("CI_USER_LOCATION")
    };

    return [
        {
            id: "28afdeb1-6fdd-464b-b03d-5526d1cc1c08",
            relatedContextInformation: [context.location],
            condition: function(R) {
                R.when(true);
            },
            consequence: function(R) {
                new StatementSender().sendHeartbeat();
                R.next();
            }
        }
    ];
});
