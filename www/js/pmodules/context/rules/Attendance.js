define([
    'underscore',
    'contactJS',
    'ContextDescriptions',
    '../StatementSender',
    '../ChangeAdapter'
], function(_, contactJS, ci, StatementSender) {

    var sender = new StatementSender();

    var context = {
        currentlyAttendedCourses: ci.get("CI_CURRENTLY_ATTENDED_COURSES")
    };

    return [
        // TODO: join course, leave course
        {
            id: "97331b06-27eb-409d-84c2-9ab009a18133",
            relatedContextInformation: [context.currentlyAttendedCourses],
            condition: function(R) {
            },
            consequence: function(R) {
            }
        }
    ];
});
