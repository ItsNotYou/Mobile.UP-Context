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
        runningCourses: ci.get("CI_CURRENTLY_RUNNING_COURSES")
    };

    return [
        {
            id: "1caf2b4f-cedf-4cad-ba58-236f68dbfcf9",
            relatedContextInformation: [context.runningCourses],
            condition: function(R) {
                R.when(context.runningCourses.isDifferentFromLastValue("CI_CURRENTLY_RUNNING_COURSES", this));
            },
            consequence: function(R) {
                var value = context.runningCourses.updateLastValue("CI_CURRENTLY_RUNNING_COURSES", this);
                var diffResult = diff(value.former, value.current);

                var sender = new StatementSender();
                _.each(diffResult.added, function(course) {
                    sender.sendOpenedCourse(course);
                });
                _.each(diffResult.removed, function(course) {
                    sender.sendClosedCourse(course);
                });

                R.next();
            }
        }
    ];
});
