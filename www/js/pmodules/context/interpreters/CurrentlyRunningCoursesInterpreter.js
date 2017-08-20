define([
    'underscore',
    'contactJS',
    'ContextDescriptions',
    'moment',
    './RunningCoursesFilter'
], function (_, contactJS, ci, moment, runningCoursesFilter) {

    var CurrentCoursesInterpreter = function (discoverer) {
        contactJS.Interpreter.call(this, discoverer);
        this.name = "CurrentCoursesInterpreter";
        return this;
    };

    CurrentCoursesInterpreter.description = {
        in: [ci.getRaw("CI_ATTENDED_COURSES"), ci.getRaw("CI_CURRENT_DATETIME")],
        out: [ci.getRaw("CI_CURRENTLY_RUNNING_COURSES")]
    };

    CurrentCoursesInterpreter.prototype = Object.create(contactJS.Interpreter.prototype);
    CurrentCoursesInterpreter.prototype.constructor = CurrentCoursesInterpreter;

    CurrentCoursesInterpreter.prototype._interpretData = function (inContextInformation, outContextInformation, callback) {
        var attendedCourses = inContextInformation.getValueForContextInformationOfKind(this.getInputContextInformation().getItems()[0]);
        var nowRaw = inContextInformation.getValueForContextInformationOfKind(this.getInputContextInformation().getItems()[1]);

        var result = [];
        if (attendedCourses === contactJS.ContextInformation.VALUE_UNKNOWN || nowRaw === contactJS.ContextInformation.VALUE_UNKNOWN) {
            result = contactJS.ContextInformation.VALUE_UNKNOWN;
        } else {
            var begin = moment(nowRaw);
            var end = moment(nowRaw);

            result = runningCoursesFilter.filterRunningCourses(begin, end, nowRaw, attendedCourses);
        }

        var response = outContextInformation.getItems()[0];
        response.setValue(result);
        callback([response]);
    };

    return CurrentCoursesInterpreter;
});
