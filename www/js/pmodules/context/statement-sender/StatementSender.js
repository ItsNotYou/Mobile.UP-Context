define([
    'ADL',
    '../xapi-data/activities',
    'json!../xapi-data/verbs.json',
    '../xapi-data/context',
    'Session',
    './BaseSender',
    './HeartbeatSender',
    './CourseSender',
    './ProfileSender'
], function(xapi, activities, verbs, context, Session, StatementSender) {

    return StatementSender;
});
