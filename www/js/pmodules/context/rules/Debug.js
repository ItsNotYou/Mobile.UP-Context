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
            id: "0a917528-befb-470e-bfa4-96e0580d6cdf",
            relatedContextInformation: [context.location],
            condition: function(R) {
                // Send values older than 10 minutes
                R.when(context.location.isOlderThan("DEBUG_USER_LOCATION", 10*60*1000, this));
            },
            consequence: function(R) {
                var value = context.location.updateLastValue("DEBUG_USER_LOCATION", this);
                new StatementSender().sendUserLocation(value.current.coords);
                R.next();
            }
        }
    ];
});
