define([
    'underscore',
    'contactJS',
    'ContextDescriptions',
    'StatementSender',
    '../ChangeAdapter'
], function(_, contactJS, ci, StatementSender) {

    var diff = function(former, current) {
        former = former ? [].concat(former) : [];
        current = current ? [].concat(current) : [];

        var sFormer = _.map(former, JSON.stringify);
        var sCurrent = _.map(current, JSON.stringify);

        var same = _.intersection(sFormer, sCurrent);
        var added = _.difference(sCurrent, same);
        var removed = _.difference(sFormer, same);

        return {
            added: _.map(added, JSON.parse),
            removed: _.map(removed, JSON.parse),
            same: _.map(same, JSON.parse)
        }
    };

    var context = {
        currentlyAttendedCourses: ci.get("CI_CURRENTLY_ATTENDED_COURSES"),
        currentTime: ci.get("CI_CURRENT_DATETIME")
    };

    return [
        {
            id: "97331b06-27eb-409d-84c2-9ab009a18133",
            relatedContextInformation: [context.currentlyAttendedCourses, context.currentTime],
            condition: function(R) {
                R.when(context.currentlyAttendedCourses.isDifferentFromLastValue("ATTENDANCE_CURRENTLY_ATTENDED_COURSES", this));
            },
            consequence: function(R) {
                var now = context.currentTime.getCurrentValue(this);
                var value = context.currentlyAttendedCourses.updateLastValue("ATTENDANCE_CURRENTLY_ATTENDED_COURSES", this);
                var diffResult = diff(value.former, value.current);

                var sender = new StatementSender();
                _.each(diffResult.added, function(course) {
                    sender.sendCourseJoined(course, now);
                });
                _.each(diffResult.removed, function(course) {
                    sender.sendCourseLeft(course, now);
                });

                R.next();
            }
        }
    ];
});
