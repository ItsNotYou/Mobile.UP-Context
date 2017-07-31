define([
    'underscore',
    'contactJS',
    'ContextDescriptions'
], function (_, contactJS, ci) {

    var CurrentlyAttendedCoursesInterpreter = function (discoverer) {
        contactJS.Interpreter.call(this, discoverer);
        this.name = "CurrentlyAttendedCoursesInterpreter";
        return this;
    };

    CurrentlyAttendedCoursesInterpreter.description = {
        in: [ci.getRaw("CI_CURRENTLY_RUNNING_COURSES_FUZZY"), ci.getRaw("CI_NEAR_BUILDINGS")],
        out: [ci.getRaw("CI_CURRENTLY_ATTENDED_COURSES")]
    };

    CurrentlyAttendedCoursesInterpreter.prototype = Object.create(contactJS.Interpreter.prototype);
    CurrentlyAttendedCoursesInterpreter.prototype.constructor = CurrentlyAttendedCoursesInterpreter;

    CurrentlyAttendedCoursesInterpreter.prototype._interpretData = function (inContextInformation, outContextInformation, callback) {
        var runningCourses = inContextInformation.getValueForContextInformationOfKind(this.getInputContextInformation().getItems()[0]);
        var nearBuildings = inContextInformation.getValueForContextInformationOfKind(this.getInputContextInformation().getItems()[1]);

        var result = [];
        if (runningCourses === contactJS.ContextInformation.VALUE_UNKNOWN || nearBuildings === contactJS.ContextInformation.VALUE_UNKNOWN) {
            result = contactJS.ContextInformation.VALUE_UNKNOWN;
        } else {
            var removeLeadingZeros = function(culprit) {
                while (culprit.length > 0 && culprit[0] === '0') {
                    culprit = culprit.substr(1);
                }
                return culprit;
            };

            result = _.chain(runningCourses)
                .map(function(course) {
                    // Parse campus and building number
                    var components = (course.building || "").split('.');
                    return {
                        location: {
                            campus: removeLeadingZeros(components[0]),
                            building: removeLeadingZeros(components[1])
                        },
                        course: course
                    }
                })
                .filter(function(model) {
                    // Find courses with near buildings
                    return _.findWhere(nearBuildings, model.location);
                })
                .map(function(model) {
                    return model.course;
                })
                .value();
        }

        var response = outContextInformation.getItems()[0];
        response.setValue(result);
        callback([response]);
    };

    return CurrentlyAttendedCoursesInterpreter;
});
