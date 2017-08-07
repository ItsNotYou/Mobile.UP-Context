define([
    'underscore',
    'ContextDescriptions',
    'StatementSender',
    '../ChangeAdapter'
], function (_, ci, StatementSender) {

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
        },
        {
            id: "0a917528-befb-470e-bfa4-96e0580d6cdf",
            relatedContextInformation: [context.location],
            condition: function(R) {
                var older = context.location.isOlderThan("DEBUG_USER_LOCATION", 60*1000, this);
                var different = context.location.isDifferentFromLastValue("DEBUG_USER_LOCATION", this);
                R.when(older || different);
            },
            consequence: function(R) {
                var value = context.location.updateLastValue("DEBUG_USER_LOCATION", this);
                new StatementSender().sendUserLocation(value.current.coords);
                R.next();
            }
        }
    ];
});
