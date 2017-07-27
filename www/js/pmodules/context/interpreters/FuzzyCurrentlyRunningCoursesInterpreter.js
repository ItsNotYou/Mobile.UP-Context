define([
    'underscore',
    'contactJS',
    'ContextDescriptions',
    'moment',
    './RunningCoursesFilter'
], function (_, contactJS, ci, moment, runningCoursesFilter) {

    var FuzzyCurrentCoursesInterpreter = function (discoverer) {
        contactJS.Interpreter.call(this, discoverer);
        this.name = "FuzzyCurrentCoursesInterpreter";
        return this;
    };

    FuzzyCurrentCoursesInterpreter.description = {
        in: [ci.getRaw("CI_ATTENDED_COURSES"), ci.getRaw("CI_CURRENT_DATETIME")],
        out: [ci.getRaw("CI_CURRENTLY_RUNNING_COURSES_FUZZY")]
    };

    FuzzyCurrentCoursesInterpreter.prototype = Object.create(contactJS.Interpreter.prototype);
    FuzzyCurrentCoursesInterpreter.prototype.constructor = FuzzyCurrentCoursesInterpreter;

    FuzzyCurrentCoursesInterpreter.prototype._interpretData = function (inContextInformation, outContextInformation, callback) {
        var attendedCourses = inContextInformation.getValueForContextInformationOfKind(this.getInputContextInformation().getItems()[0]);
        var nowRaw = inContextInformation.getValueForContextInformationOfKind(this.getInputContextInformation().getItems()[1]);

        var result = [];
        if (attendedCourses === contactJS.ContextInformation.VALUE_UNKNOWN || nowRaw === contactJS.ContextInformation.VALUE_UNKNOWN) {
            result = contactJS.ContextInformation.VALUE_UNKNOWN;
        } else {
            var begin = moment(nowRaw).add(10, "minutes");
            var end = moment(nowRaw).subtract(10, "minutes");

            result = runningCoursesFilter.filterRunningCourses(begin, end, nowRaw, attendedCourses);

            console.log("Currently running courses (fuzzy)", result);
        }

        var response = outContextInformation.getItems()[0];
        response.setValue(result);
        callback([response]);
    };

    return FuzzyCurrentCoursesInterpreter;
});
