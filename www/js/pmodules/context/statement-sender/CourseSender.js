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
     * @param {string} date ISO representation of a date. The time part is ignored
     * @param {string} time Time in the format HH:mm
     * @returns {string} ISO representation of the given date and time
     */
    var createTimestamp = function(date, time) {
        var timeSplit = time.split(':');
        var now = moment(date).set({
            "hours": parseInt(timeSplit[0]),
            "minutes": parseInt(timeSplit[1]),
            "seconds": 0,
            "milliseconds": 0
        });
        return now.toISOString();
    };

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

        this._sendStatement(stmt);
    };

    StatementSender.prototype.sendOpenedCourse = function(courseAndEvent) {
        // Set event lecturer
        var lecturers = [].concat(courseAndEvent.lecturers.lecturer);
        var lecturerName = lecturers[0].lecturerFirstname + " " + lecturers[0].lecturerLastname;
        var lecturerMail = lecturers[0].lecturerEmail;
        var lecturer = new xapi.ADL.XAPIStatement.Agent('mailto:' + lecturerMail, lecturerName);

        // Create statement
        var stmt = new xapi.ADL.XAPIStatement(
            lecturer,
            verbs.opened,
            activities.courseEvent(courseAndEvent)
        );
        stmt.context = context.attendance_detailed();

        // Set event start time
        stmt.timestamp = createTimestamp(courseAndEvent.today, courseAndEvent.startTime);

        this._sendStatement(stmt);
    };

    StatementSender.prototype.sendClosedCourse = function(courseAndEvent) {
        // Set event lecturer
        var lecturers = [].concat(courseAndEvent.lecturers.lecturer);
        var lecturerName = lecturers[0].lecturerFirstname + " " + lecturers[0].lecturerLastname;
        var lecturerMail = lecturers[0].lecturerEmail;
        var lecturer = new xapi.ADL.XAPIStatement.Agent('mailto:' + lecturerMail, lecturerName);

        // Create statement
        var stmt = new xapi.ADL.XAPIStatement(
            lecturer,
            verbs.closed,
            activities.courseEvent(courseAndEvent)
        );
        stmt.context = context.attendance_detailed();

        // Set event start time
        stmt.timestamp = createTimestamp(courseAndEvent.today, courseAndEvent.endTime);

        this._sendStatement(stmt);
    };

    return StatementSender;
});
