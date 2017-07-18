define([
    'underscore',
    'StatementSender',
    './ChangeDetector',
    'AdaptationEngine',
    './rules/rules'
], function (_, StatementSender, ChangeDetector, AdaptationEngine, rules) {

    /**
     * Default start options for the context detector
     * @type {{ruleInterval: number}}
     */
    var defaultStartOptions = {
        ruleInterval: 10000
    };

    function ContextDetector() {
    }

    /**
     * Starts the context detection and regularly executes the defined rules
     * @param startOptions
     */
    ContextDetector.prototype.start = function (startOptions) {
        var ae = new AdaptationEngine(_.flatten(rules), false);
        ae.startRuleMatching(20000);
    };

    /**
     * Adds a number of rules to tbe context engine. These rules search the available context data based on the defined conditions and execute the associated callbacks
     * @param rules the rules to add
     */
    ContextDetector.prototype.addRules = function (rules) {
    };

    /*
    try {
        var sender = new StatementSender();
        sender.sendAttendedCourse({
            semester: 2013,
            headerId: 53320
        });
        sender.sendDeviceDetails({
            language: "de-DE",
            phoneNumbers: "+49 123 5592204",
            uuid: "c238e793-5087-49db-9d52-e62e8fbfcda6"
        });
        sender.sendServiceLogin({
            provider: "facebook",
            identity: "somebody"
        });
        sender.sendUserLocation({
            latitude: 48.857419,
            longitude: 2.292988
        });
    } catch (e) {
        console.error(e);
    }

    var last = new ChangeDetector();
    if (last.isDifferentFromLastValue("course", {
            semester: 2013,
            headerId: 53320
        })) {
        console.log("Change detected. Update started");
        last.updateLastValue("course", {
            semester: 2013,
            headerId: 53320
        });
    } else {
        console.log("No update required");
    }
    */

    return ContextDetector;
});
