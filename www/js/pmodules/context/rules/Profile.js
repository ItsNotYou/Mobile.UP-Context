define([
    'underscore',
    'jquery',
    'contactJS',
    'ContextDescriptions',
    '../StatementSender',
    '../ChangeAdapter'
], function (_, $, _contactJS, ci, StatementSender) {

    var _d = new _contactJS.Discoverer();
    var sender = new StatementSender();

    var newCourses = function(former, current) {
        var formerJson = _.map(former, JSON.stringify);
        var currentJson = _.map(current, JSON.stringify);

        var diff = _.difference(currentJson, formerJson);
        return _.map(diff, JSON.parse);
    };

    var context = {
        deviceInfo: ci.get("CI_DEVICE_INFO"),
        attendedCourses: ci.get("CI_ATTENDED_COURSES")
    };

    return [
        {
            id: "c7c7ba19-08e0-44d3-b91d-7b7b717484ed",
            relatedContextInformation: [context.deviceInfo],
            condition: function(R) {
                R.when(context.deviceInfo.isDifferentFromLastValue("PROFILE_CI_DEVICE_INFO", this));
            },
            consequence: function(R) {
                var value = context.deviceInfo.updateLastValue("PROFILE_CI_DEVICE_INFO", this);
                sender.sendDeviceDetails(value.current);
                console.log("CI_DEVICE_INFO rule fired");
                R.next();
            }
        },
        {
            id: "6b47eb35-b84f-4cc2-a264-146113e985df",
            relatedContextInformation: [context.attendedCourses],
            condition: function(R) {
                R.when(context.attendedCourses.isDifferentFromLastValue("PROFILE_CI_ATTENDED_COURSES", this));
            },
            consequence: function(R) {
                var value = context.attendedCourses.updateLastValue("PROFILE_CI_ATTENDED_COURSES", this);
                var courses = newCourses(value.former, value.current);
                debugger;
                _.each(courses, function(course) {
                    sender.sendAttendedCourse(course);
                });

                R.next();
            }
        }
    ];
});
