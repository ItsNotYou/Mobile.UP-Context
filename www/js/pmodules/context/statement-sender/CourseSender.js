define([
    'ADL',
    '../xapi-data/activities',
    'json!../xapi-data/verbs.json',
    '../xapi-data/context',
    './BaseSender',
    'moment'
], function(xapi, activities, verbs, context, StatementSender, moment) {

    /**
     *
     * @param course
     * @param {string} course.semester Course semester
     * @param {string} course.headerId Course header id as noted in university calendar
     */
    StatementSender.prototype.sendAttendedCourse = function(course) {
        var stmt = new xapi.ADL.XAPIStatement(
            this._agent,
            verbs.attended,
            activities.event(course)
        );
        stmt.context = context.attendance_simple();

        console.log(stmt);

        // TODO: Add to send queue?
        xapi.ADL.XAPIWrapper.sendStatement(stmt, function(err, res, body) {
            if (err) {
                console.error(err);
                return;
            }

            console.log("[" + body.id + "]: " + res.status + " - " + res.statusText);
        });
    };

    StatementSender.prototype.sendOpenedCourse = function(courseAndEvent) {
        var lecturers = [].concat(courseAndEvent.lecturers.lecturer);
        var lecturerName = lecturers[0].lecturerFirstname + " " + lecturers[0].lecturerLastname;
        var lecturerMail = lecturers[0].lecturerEmail;
        var lecturer = new xapi.ADL.XAPIStatement.Agent('mailto:' + lecturerMail, lecturerName);

        var stmt = new xapi.ADL.XAPIStatement(
            lecturer,
            verbs.opened,
            activities.courseEvent(courseAndEvent)
        );
        stmt.context = context.attendance_detailed();
        stmt.timestamp = moment(courseAndEvent.startDate + " " + courseAndEvent.startTime, "DD.MM.YYYY HH:mm").toISOString();

        // TODO: Add to send queue?
        xapi.ADL.XAPIWrapper.sendStatement(stmt, function(err, res, body) {
            if (err) {
                console.error(err);
                return;
            }

            console.log("[" + body.id + "]: " + res.status + " - " + res.statusText);
        });
    };

    return StatementSender;
});
