define([
    'underscore',
    'Session',
    'AppEvents',
    'StatementSender',
    './ChangeDetector',
    'AdaptationEngine',
    './rules/rules'
], function (_, Session, appEvents, StatementSender, ChangeDetector, AdaptationEngine, rules) {

    /**
     * Default start options for the context detector
     * @type {{ruleInterval: number}}
     */
    var defaultStartOptions = {
        ruleInterval: 10000
    };

    var ContextDetector = function() {};

    /**
     * Starts the context detection and regularly executes the defined rules
     * @param startOptions
     */
    ContextDetector.prototype.start = function (startOptions) {
        this.ae = new AdaptationEngine(_.flatten(rules), false);
        this.ae.startRuleMatching(20000);
        appEvents.trigger("context_started");
        return this;
    };

    ContextDetector.prototype.stop = function() {
        this.ae.stopRuleMatching();
        appEvents.trigger("context_stopped");
        return this;
    };

    var detector = undefined;

    var startDetector = function() {
        var isLoggedIn = new Session().get('up.session.authenticated');
        if (!detector && isLoggedIn) {
            console.log("Starte ContextDetector");
            detector = new ContextDetector().start();
        } else {
            console.log("Starte ContextDetector NICHT");
        }
    };

    var stopDetector = function() {
        if (detector) {
            detector.stop();
            detector = undefined;
        }
    };

    appEvents.on("app_started", startDetector);
    appEvents.on("logged_in", startDetector);
    appEvents.on("logged_out", stopDetector);

    return ContextDetector;
});
