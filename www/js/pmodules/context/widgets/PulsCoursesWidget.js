define([
    'underscore',
    'contactJS',
    'ContextDescriptions',
    'pmodules/calendar/calendar.common'
], function(_, contactJS, ci, calendar) {

    var PulsCoursesWidget = function(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = "PulsCoursesWidget";
        return this;
    };

    PulsCoursesWidget.prototype = Object.create(contactJS.Widget.prototype);
    PulsCoursesWidget.prototype.constructor = PulsCoursesWidget;

    PulsCoursesWidget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    PulsCoursesWidget.description = {
        out: [ci.getRaw("CI_ATTENDED_COURSES")],
        const: [{ name: "", type: "" }],
        updateInterval: 1000 * 60 * 12 // twice a day
    };

    PulsCoursesWidget.prototype.queryGenerator = function(callback) {
        var courses = new calendar.CourseList();
        courses.fetch({
            success: _.bind(function() {
                /**
                 * Each course must have the following attributes
                 * - courseId
                 * - courseName
                 * - events
                 */
                var result = courses.chain()
                    .map(function(model) { return model.toJSON(); })
                    .filter(function(model) {
                        return model.courseId &&
                            model.courseName &&
                            model.events &&
                            model.events.event &&
                            model.events.event.length > 0;
                    })
                    .value();

                var response = new contactJS.ContextInformationList();
                response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
                this._sendResponse(response, callback);
            }, this),
            error: _.bind(function() {
                var response = new contactJS.ContextInformationList();
                response.put(this.getOutputContextInformation().getItems()[0].setValue(contactJS.ContextInformation.VALUE_UNKNOWN));
                this._sendResponse(response, callback);
            }, this)
        });
    };

    return PulsCoursesWidget;
});
