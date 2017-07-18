define([
    'underscore',
    'contactJS',
    'ContextDescriptions',
    'pmodules/calendar/calendar.common',
    'moment'
], function (_, contactJS, ci, calendar, moment) {

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

            result = _.chain(attendedCourses)
                .map(function(model) { return new calendar.Course(model, {parse: true}); })
                .map(function(course) {
                    return _.map(course.getEvents(), function(event) {
                        return {
                            course: course,
                            event: event
                        }
                    })
                })
                .flatten()
                .filter(function(ce) {
                    return ce.course.getStarting().isBefore(begin) && ce.course.getEnding().isAfter(end);
                })
                .filter(function(ce) {
                    var courseStarting = ce.course.getStarting();
                    var event = ce.event;
                    return event.isOnDay(begin, courseStarting) || event.isOnDay(end, courseStarting);
                })
                .map(function(ce) { return ce.event.toJSON(); })
                .value();
        }

        var response = outContextInformation.getItems()[0];
        response.setValue(result);
        callback([response]);
    };

    return CurrentCoursesInterpreter;
});
