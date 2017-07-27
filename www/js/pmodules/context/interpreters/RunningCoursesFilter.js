define([
    'underscore',
    'pmodules/calendar/calendar.common',
    'moment'
], function (_, calendar, moment) {

    var filterRunningCourses = function(begin, end, nowRaw, attendedCourses) {
        return _.chain(attendedCourses)
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
                var flatBegin = moment(begin).set({
                    "hour": 0,
                    "minute": 0,
                    "second": 0,
                    "millisecond": 0
                });
                var flatEnd = moment(end).set({
                    "hour": 0,
                    "minute": 0,
                    "second": 0,
                    "millisecond": 0
                });

                var courseStarting = ce.course.getStarting();
                var courseEnding = ce.course.getEnding();

                return courseStarting <= flatBegin && courseEnding >= flatEnd;
            })
            .filter(function(ce) {
                var courseStarting = ce.course.getStarting();
                var event = ce.event;
                return event.isOnDay(begin, courseStarting) || event.isOnDay(end, courseStarting);
            })
            .filter(function(ce) {
                var event = ce.event;

                var eventBegin = parseInt(event.get('startTime').replace(':', ''));
                var eventEnd = parseInt(event.get('endTime').replace(':', ''));

                var localBegin = begin.get("hour") * 100 + begin.get("minute");
                var localEnd = end.get("hour") * 100 + end.get("minute");

                return eventBegin <= localBegin && localEnd <= eventEnd;
            })
            .map(function(ce) {
                // We have to use "today" instead of "now" because "now" would make comparison between two timestamp dependant
                var today = moment(nowRaw).set({
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    milliseconds: 0
                });
                ce.event.set("today", today.toISOString());
                return ce.event.toJSON();
            })
            .value();
    };

    return {
        filterRunningCourses: filterRunningCourses
    }
});
